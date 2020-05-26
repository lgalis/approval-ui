import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { delay } from 'xhr-mock';

import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import EditWorkflowGroupsModal from '../../../smart-components/workflow/edit-workflow-groups-modal';
import { WorkflowInfoFormLoader } from '../../../presentational-components/shared/loader-placeholders';
import { IntlProvider } from 'react-intl';
import FormRenderer from '../../../smart-components/common/form-renderer';
import routes from '../../../constants/routes';

describe('<EditWorkflowGroupsModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let wrapper;
  let store;

  const ComponentWrapper = ({ store, initialEntries, children }) => (
    <IntlProvider locale="en">
      <Provider store={ store }>
        <MemoryRouter initialEntries={ initialEntries }>
          { children }
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    apiClientMock.reset();
    initialProps = {
      postMethod: jest.fn()
    };
    mockStore = configureStore(middlewares);
    store = mockStore({
      workflowReducer: {
        workflows: { data: []}
      }
    });
  });

  it('should mount with loader placeholder', async () => {
    jest.useFakeTimers();

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, delay({ body: {
      group_refs: []
    }}, 20));

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo?workflow=123' ] } store={ store } >
          <Route path="/foo" render={ props => <EditWorkflowGroupsModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );
    });

    wrapper.update();
    expect(wrapper.find(WorkflowInfoFormLoader)).toHaveLength(1);

    jest.useRealTimers();
  });

  it('should mount with no groups title', async () => {
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo?workflow=123' ] } store={ store } >
          <Route path="/foo" render={ props => <EditWorkflowGroupsModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    expect(wrapper.find(WorkflowInfoFormLoader)).toHaveLength(0);
  });

  it('should mount with SetGroups child component', async () => {
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo?workflow=123' ] } store={ store } >
          <Route path="/foo" render={ props => <EditWorkflowGroupsModal
            { ...props }
            { ...initialProps }
          /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    expect(wrapper.find(FormRenderer)).toHaveLength(1);
  });

  it('should mount with workflow in the table', async () => {
    const store = mockStore({ workflowReducer: {
      workflows: {
        data: [
          { id: '123', name: 'pokus', group_refs: []}
        ]
      }
    },
    groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    let wrapper;

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo?workflow=123' ] } store={ store } >
          <Route path="/foo" render={ props => <EditWorkflowGroupsModal
            { ...props }
            { ...initialProps }
          /> }/>
        </ComponentWrapper>
      );
    });

    wrapper.update();
    expect(wrapper.find('.pf-c-form__label').last().text().includes('pokus')).toEqual(true);
  });

  it('should call onCancel and push to history', async () => {
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo?workflow=123' ] } store={ store } >
          <Route path="/foo" render={ props => <EditWorkflowGroupsModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    wrapper.find('button').last().simulate('click');

    const history = wrapper.find(MemoryRouter).instance().history;
    expect(history.length).toEqual(2);
    expect(history.location.pathname).toEqual(routes.workflows.index);
  });

  it('should call onSave and push to history', async () => {
    const postMethod = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      { body: { data: []}});
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    apiClientMock.patch(`${APPROVAL_API_BASE}/workflows/123`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ id: '123', group_refs: []});
      return res.status(200);
    }));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo?workflow=123' ] } store={ store } >
          <Route path="/foo" render={ props => <EditWorkflowGroupsModal { ...props } { ...initialProps } postMethod={ postMethod } /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    await act(async() => {
      wrapper.find('form').simulate('submit');
    });

    expect(postMethod).toHaveBeenCalled();

    const history = wrapper.find(MemoryRouter).instance().history;
    expect(history.length).toEqual(2);
    expect(history.location.pathname).toEqual('/workflows');
  });
});

