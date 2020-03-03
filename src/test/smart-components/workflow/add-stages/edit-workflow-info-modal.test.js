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
import WorkflowInfoForm from '../../../../smart-components/workflow/add-stages/stage-information';
import { APPROVAL_API_BASE } from '../../../../utilities/constants';
import { WorkflowInfoFormLoader } from '../../../../presentational-components/shared/loader-placeholders';

const ComponentWrapper = ({ store, children }) => (
  <Provider store={ store }>
    <MemoryRouter initialEntries={ [ '/foo/123' ] }>
      { children }
    </MemoryRouter>
  </Provider>
);

describe('<EditWorkflowInfoModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  beforeEach(() => {
    initialProps = {
      postMethod: jest.fn()
    };
    mockStore = configureStore(middlewares);
    initialState = {
      workflowReducer: {
        workflow: {
          name: 'Foo',
          id: '123',
          description: 'description'
        }
      }
    };
  });

  it('should render WorkflowInfoForm and fetch data', async done => {
    const store = mockStore(initialState);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {}}));
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(WorkflowInfoForm)).toHaveLength(1);
    done();
  });

  it('should render WorkflowInfoFormLoader', async done => {
    const store = mockStore({
      workflowReducer: { isRecordLoading: true }
    });
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {}}));
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(WorkflowInfoFormLoader)).toHaveLength(1);
    done();
  });

  it('should call cancel callback and redirect to approval processes', async done => {
    const store = mockStore(initialState);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {}}));
    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    wrapper.find('button#cancel-edit-workflow-info').simulate('click');
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows');
    done();
  });

  it('should change form data and call onSave callback', async done => {
    const store = mockStore(initialState);
    let wrapper;

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
          <Route path="/foo/:id" render={ props => <EditWorkflowInfoModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const input = wrapper.find('input#workflow-name');
    input.getDOMNode().value = 'name';
    input.simulate('change');
    wrapper.update();

    await act(async() => {
      wrapper.find('button#save-edit-workflow-info').simulate('click');
    });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows');
    done();
  });
});
