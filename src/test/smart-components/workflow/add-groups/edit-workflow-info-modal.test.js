import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

import EditWorkflowInfoModal from '../../../../smart-components/workflow/edit-workflow-info-modal';
import { APPROVAL_API_BASE } from '../../../../utilities/constants';
import { WorkflowInfoFormLoader } from '../../../../presentational-components/shared/loader-placeholders';

import routes from '../../../../constants/routes';
import { Title } from '@patternfly/react-core';
import { IntlProvider } from 'react-intl';
import FormRenderer from '../../../../smart-components/common/form-renderer';
import { delay } from 'xhr-mock';

const ComponentWrapper = ({ store, children }) => (
  <IntlProvider locale="en">
    <Provider store={ store }>
      <MemoryRouter initialEntries={ [ '/foo/?workflow=123' ] }>
        { children }
      </MemoryRouter>
    </Provider>
  </IntlProvider>
);

describe('<EditWorkflowInfoModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let workflow;
  let store;
  let wrapper;

  beforeEach(() => {
    initialProps = {
      postMethod: jest.fn()
    };
    mockStore = configureStore(middlewares);

    workflow = {
      name: 'Foo',
      id: '123',
      description: 'description'
    };

    store = mockStore({});
  });

  afterEach(() => {
    apiClientMock.teardown();
    apiClientMock.setup();
  });

  it('should render form and fetch data', async () => {
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: workflow }));
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });

    wrapper.update();

    expect(wrapper.find(FormRenderer).props().initialValues).toEqual(workflow);
  });

  it('should render WorkflowInfoForm when workflow is in table', async done => {
    const store = mockStore({
      workflowReducer: {
        workflows: {
          data: [
            { id: '123', name: 'pokus' }
          ]
        }
      }
    });
    let wrapper;

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(Title).last().text().includes('pokus')).toEqual(true);
    done();
  });

  it('should render WorkflowInfoFormLoader', async () => {
    jest.useFakeTimers();

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, delay({ body: {}}));

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(WorkflowInfoFormLoader)).toHaveLength(1);

    jest.useRealTimers();
  });

  it('should call cancel callback and redirect to approval processes', async () => {
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {}}));
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('button').last().simulate('click');
    });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.index);
  });

  it('should change form data and call onSave callback', async () => {
    expect.assertions(2);
    jest.useFakeTimers();

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=name&limit=50&offset=0`,
      mockOnce({ body: { data: [{
        id: '123',
        name: 'foo'
      }]}}));
    apiClientMock.patch(`${APPROVAL_API_BASE}/workflows/123`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({
        id: '123',
        name: 'name'
      });
      return res.status(200);
    }));

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      const input = wrapper.find('input#workflow-name');
      input.getDOMNode().value = 'name';
      input.simulate('change');
    });
    wrapper.update();

    jest.advanceTimersByTime(250);

    wrapper.update();

    await act(async() => {
      wrapper.find('button').at(1).simulate('submit');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.index);
  });
});
