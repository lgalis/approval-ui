import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { act } from 'react-dom/test-utils';

import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import EditWorkflow from '../../../../smart-components/workflow/edit-workflow-modal';
import { IntlProvider } from 'react-intl';
import { RBAC_API_BASE, APPROVAL_API_BASE } from '../../../../utilities/constants';
import * as wfHelper from '../../../../helpers/workflow/workflow-helper';
import { Button } from '@patternfly/react-core';
import routes from '../../../../constants/routes';
import { Chip } from '@patternfly/react-core';

describe('<EditWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;
  let workflow;
  let wrapper;

  const ComponentWrapper = ({ store, children }) => (
    <IntlProvider locale="en">
      <Provider store={ store }>
        <MemoryRouter initialEntries={ [ '/workflows/edit-workflow/?workflow=123' ] } initialIndex={ 0 }>
          { children }
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123',
      postMethod: jest.fn(),
      handleChange: jest.fn()
    };

    initialState = {
      workflowReducer: {
        workflows: {
          data: []
        }}
    };

    workflow = {
      name: 'Foo',
      id: '123',
      description: 'description',
      group_refs: [{
        uuid: '123',
        name: 'SampleWorkflow'
      }]
    };

    mockStore = configureStore(middlewares);
  });

  it('should load workflow from redux', async () => {
    initialState = {
      workflowReducer: {
        workflows: {
          data: [{
            id: '123',
            name: 'new_name',
            description: 'super description',
            group_refs: [{
              uuid: '467',
              name: 'some new group'
            }]
          }]
        }}
    };

    wfHelper.fetchWorkflowByName = jest.fn().mockImplementation(() => Promise.resolve({
      data: []
    }));

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: [{ uuid: 'id', name: 'name' }]}}));

    jest.useFakeTimers();

    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows/edit-workflow" render={ () => <EditWorkflow { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // initial async validation
      jest.useRealTimers();
    });
    wrapper.update();

    expect(wrapper.find('input').first().props().value).toEqual(initialState.workflowReducer.workflows.data[0].name);
    expect(wrapper.find('textarea').first().props().value).toEqual(initialState.workflowReducer.workflows.data[0].description);
    expect(wrapper.find(Chip).last().props().children).toEqual('some new group');
  });

  it('should fetch data from api and submit the form', async () => {
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: workflow }));

    expect.assertions(8);

    wfHelper.fetchWorkflowByName = jest.fn().mockImplementationOnce(
      (value) => {
        expect(value).toEqual(workflow.name);

        return Promise.resolve({
          data: []
        });
      }
    ).mockImplementationOnce(
      (value) => {
        expect(value).toEqual('some-name');

        return Promise.resolve({
          data: []
        });
      }
    );

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: [{ uuid: 'id', name: 'name' }]}}));

    jest.useFakeTimers();

    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows/edit-workflow/" render={ () => <EditWorkflow { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // initial async validation
    });
    wrapper.update();

    expect(wrapper.find('input').first().props().value).toEqual(workflow.name);
    expect(wrapper.find('textarea').first().props().value).toEqual(workflow.description);
    expect(wrapper.find(Chip).last().props().children).toEqual('SampleWorkflow');

    await act(async () => {
      const name = wrapper.find('input').first();
      name.instance().value = 'some-name';
      name.simulate('change');
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // name async validaton
      jest.useRealTimers();
    });
    wrapper.update();

    await act(async () => {
      const description = wrapper.find('textarea').first();
      description.instance().value = 'some-description';
      description.simulate('change');
    });
    wrapper.update();

    wfHelper.updateWorkflow = jest.fn().mockImplementation(() => Promise.resolve('ok'));

    expect(wfHelper.updateWorkflow).not.toHaveBeenCalled();

    await act(async () => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(wfHelper.updateWorkflow).toHaveBeenCalledWith({
      ...workflow,
      name: 'some-name',
      description: 'some-description'
    });

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.index);
  });

  it('should close the form', async () => {
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({ body: workflow }));

    wfHelper.fetchWorkflowByName = jest.fn().mockImplementation(() => Promise.resolve({
      data: []
    }));

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: [{ uuid: 'id', name: 'name' }]}}));

    jest.useFakeTimers();

    const store = mockStore(initialState);

    await act(async () => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows/edit-workflow" render={ () => <EditWorkflow { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(550); // initial async validation
      jest.useRealTimers();
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Button).first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.index);
  });
});
