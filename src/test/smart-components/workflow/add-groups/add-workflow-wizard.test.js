import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';

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
});
