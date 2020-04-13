import React from 'react';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import AsyncSelect from 'react-select/async';

import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../../../utilities/constants';
import AddWorkflow from '../../../../smart-components/workflow/add-groups/add-workflow-wizard';
import { ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/index';
import { mount } from 'enzyme/build/index';

describe('<AddWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ [ '/workflows/', '/workflows/add-workflow/', '/workflows/' ] } initialIndex={ 1 }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123',
      postMethod: jest.fn(),
      handleChange: jest.fn()
    };

    initialState = {
      groupReducer: {
        groups: [{
          label: 'foo',
          value: 'bar'
        }]
      },
      workflowReducer: {
        workflows: { data: { id: 1, group_refs: [{
          uuid: '123',
          name: 'SampleWorkflow'
        }]}
        }}
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    const wrapper = shallow(<ComponentWrapper store={ store }><AddWorkflow { ...initialProps } /></ComponentWrapper>).dive();

    setImmediate(() => {
      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should post a warning message on Cancel', (done) => {
    const store = mockStore(initialState);

    apiClientMock.put(`${APPROVAL_API_BASE}/workflows/`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200);
    }));

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200).body({ data: []});
    }));

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce((req, res) => {
        expect(req).toBeTruthy();
        return res.status(200).body({ data: []});
      }));

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route path="/workflows/add-workflow/" render={ () => <AddWorkflow { ...initialProps } /> } />
      </ComponentWrapper>
    );
    const expectedActions = expect.arrayContaining([
      expect.objectContaining({
        type: ADD_NOTIFICATION,
        payload: expect.objectContaining({
          title: 'Creating approval process',
          variant: 'warning',
          description: 'Creating approval process was cancelled by the user.',
          dismissable: true
        })
      }) ]);

    wrapper.find('Button').at(0).simulate('click');
    setImmediate(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('should travers over all wizard pages and call onSave function', async(done) => {
    const store = mockStore(initialState);
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=Test3&limit=50&offset=0`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/templates`, mockOnce({ body: { data: [{ id: '123' }]}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: [{ uuid: '3', name: 'Group3' }, { uuid: '1', name: 'Group1' }]}}));
    apiClientMock.post(`${APPROVAL_API_BASE}/templates/123/workflows`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ name: 'Test3', group_refs: []});
      done();
      return res.status(200);
    }));

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route path="/workflows/add-workflow/" render={ () => <AddWorkflow { ...initialProps }
          formData={ { name: 'Test1', wfGroups: []} } /> } />
      </ComponentWrapper>
    );

    await act(async() => {
      //wrapper.find('input').simulate('change', { target: { name: 'Test2' }});
      const input = wrapper.find('input').at(0);
      input.instance().value = 'Test3';
      input.simulate('change');
    });

    wrapper.update();
    await act(async() => {
      wrapper.find('button.pf-c-button.pf-m-primary').first().simulate('click');
    });

    wrapper.update();
    wrapper.find(AsyncSelect).props().onChange({ value: '3', label: 'group1' });

    wrapper.update();
    await act(async() => {
      wrapper.find('button.pf-c-button.pf-m-primary').first().simulate('click');
    });

    wrapper.update();
    /**
     * submit wizard
     */
    await act(async() => {
      wrapper.find('button.pf-c-button.pf-m-primary').first().simulate('click');
    });
  });
});
