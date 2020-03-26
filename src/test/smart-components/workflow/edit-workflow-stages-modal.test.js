import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import EditWorkflowStagesModal from '../../../smart-components/workflow/edit-workflow-stages-modal';
import { WorkflowInfoFormLoader } from '../../../presentational-components/shared/loader-placeholders';
import SetStages from '../../../smart-components/workflow/add-stages/set-stages';

describe('<EditWorkflowStagesModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, initialEntries, children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      postMethod: jest.fn()
    };
    mockStore = configureStore(middlewares);
  });

  it('should mount with loader placeholder', async done => {
    const store = mockStore({ workflowReducer: { isRecordLoading: true },
      groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo/123' ] } store={ store } >
          <Route path="/foo/:id" render={ props => <EditWorkflowStagesModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    expect(wrapper.find(WorkflowInfoFormLoader)).toHaveLength(1);
    done();
  });

  it('should mount with no groups title', async done => {
    const store = mockStore({ workflowReducer: { isRecordLoading: false },
      groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    let wrapper;

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22Approval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo/123' ] } store={ store } >
          <Route path="/foo/:id" render={ props => <EditWorkflowStagesModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    expect(wrapper.find(WorkflowInfoFormLoader)).toHaveLength(0);
    done();
  });

  it('should mount with SetStages child component', async done => {
    const store = mockStore({ workflowReducer: { isRecordLoading: false },
      groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    let wrapper;

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22Approval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo/123' ] } store={ store } >
          <Route path="/foo/:id" render={ props => <EditWorkflowStagesModal
            { ...props }
            { ...initialProps }
          /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    expect(wrapper.find(SetStages)).toHaveLength(1);
    done();
  });

  it('should call onCancel and push to history', async done => {
    const store = mockStore({ workflowReducer: { isRecordLoading: false },
      groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    let wrapper;

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22Approval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo/123' ] } store={ store } >
          <Route path="/foo/:id" render={ props => <EditWorkflowStagesModal { ...props } { ...initialProps } /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    wrapper.find('button').last().simulate('click');

    const history = wrapper.find(MemoryRouter).instance().history;
    expect(history.length).toEqual(2);
    expect(history.location.pathname).toEqual('/workflows');
    done();
  });

  it('should call onSave and push to history', async done => {
    const store = mockStore({ workflowReducer: { isRecordLoading: false },
      groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    const postMethod = jest.fn().mockImplementation(() => new Promise(resolve => resolve(true)));
    let wrapper;

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22Approval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: {
      group_refs: []
    }}));

    apiClientMock.patch(`${APPROVAL_API_BASE}/workflows/123`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ id: '123', group_refs: []});
      return res.status(200);
    }));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper initialEntries={ [ '/foo/123' ] } store={ store } >
          <Route path="/foo/:id" render={ props => <EditWorkflowStagesModal { ...props } { ...initialProps } postMethod={ postMethod } /> }/>
        </ComponentWrapper>
      );

    });

    wrapper.update();
    await act(async() => {
      wrapper.find('button.pf-c-button.pf-m-primary').simulate('click');
    });

    expect(postMethod).toHaveBeenCalled();

    const history = wrapper.find(MemoryRouter).instance().history;
    expect(history.length).toEqual(2);
    expect(history.location.pathname).toEqual('/workflows');
    done();
  });
});

