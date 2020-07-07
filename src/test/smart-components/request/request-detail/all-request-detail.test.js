import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import AllRequestDetail from '../../../../smart-components/request/request-detail/my-request-detail';
import { RequestLoader } from '../../../../presentational-components/shared/loader-placeholders';
import { APPROVAL_API_BASE } from '../../../../utilities/constants';
import RequestInfoBar from '../../../../smart-components/request/request-detail/request-info-bar';
import RequestTranscript from '../../../../smart-components/request/request-detail/request-transcript';
import { mockGraphql } from '../../../__mocks__/user-login';
import { BreadcrumbItem } from '@patternfly/react-core';
import routes from '../../../../constants/routes';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import requestReducer, { requestsInitialState } from '../../../../redux/reducers/request-reducer';
import UserContext from '../../../../user-context';
import ActionModal from '../../../../smart-components/request/action-modal';
import { APPROVAL_ADMINISTRATOR_ROLE } from '../../../../helpers/shared/helpers';

const ComponentWrapper = ({ store, children, initialEntries = [ '/foo?request=123' ]}) => (
  <Provider store={ store } >
    <MemoryRouter initialEntries={ initialEntries }>
      { children }
    </MemoryRouter>
  </Provider>
);

describe('<AllRequestDetail />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;
  let roles;

  beforeEach(() => {
    initialProps = {
      breadcrumbs: [{
        title: 'Foo'
      }]
    };
    roles = {};
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: {
        isRequestDataLoading: true,
        selectedRequest: { id: '123', name: 'Test product', group_name: 'Test group' },
        requestContent: {}
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render request details', async done => {
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/content`, mockOnce({ body: { params: { test: 'value' },
      product: 'Test product', order_id: '321', portfolio: 'TestPortfolio' }}));
    const store = mockStore(
      initialState = {
        requestReducer: {
          selectedRequest: {
            actions: [{
              id: '266', created_at: '2019-12-20',
              request_id: '123', processed_by: 'system', operation: 'start'
            }],
            created_at: '2019-12-20',
            decision: 'undecided',
            group_name: 'Test Group',
            id: '123',
            name: 'Test Product',
            notified_at: '2019-12-20',
            number_of_children: 0,
            number_of_finished_children: 0,
            owner: 'test_owner',
            requester_name: 'A Name',
            state: 'notified',
            workflow_id: '123'
          },
          requestContent: {
            order_id: '363',
            params: {},
            portfolio: 'Portfolio',
            product: 'Product'
          },
          isRequestDataLoading: false
        }
      }
    );
    mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200, {
      data: {
        requests: [
          {
            actions: [],
            id: '124',
            name: 'Hello World',
            number_of_children: '0',
            decision: 'undecided',
            description: null,
            group_name: 'Catalog IQE approval',
            number_of_finished_children: '0',
            parent_id: '123',
            state: 'pending',
            workflow_id: '100'
          },

          {
            actions: [],
            id: '125',
            name: 'Hello World',
            number_of_children: '0',
            decision: 'undecided',
            description: null,
            group_name: 'Group1',
            number_of_finished_children: '0',
            parent_id: '123',
            state: 'pending',
            workflow_id: '200'
          },

          {
            actions: [
              {
                id: '1',
                operation: 'start',
                comments: null,
                created_at: '2020-01-29T17:08:56.850Z',
                processed_by: 'system'
              },
              {
                id: '2',
                operation: 'notify',
                comments: null,
                created_at: '2020-01-29T17:09:14.994Z',
                processed_by: 'system'
              }
            ],
            id: '126',
            name: 'Hello World',
            number_of_children: '0',
            decision: 'undecided',
            description: null,
            group_name: 'Group2',
            number_of_finished_children: '0',
            parent_id: '123',
            state: 'notified',
            workflow_id: '300'
          }
        ]
      }
    });

    let wrapper;
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo" render={ props => <AllRequestDetail { ...props } { ...initialProps } isFetching={ false }/> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    expect(wrapper.find(RequestInfoBar)).toHaveLength(1);
    expect(wrapper.find(RequestTranscript)).toHaveLength(1);

    expect(wrapper.find(BreadcrumbItem)).toHaveLength(2);
    expect(wrapper.find(BreadcrumbItem).first().text()).toEqual('My requests');
    expect(wrapper.find(BreadcrumbItem).first().props().isActive).toEqual(false);

    expect(wrapper.find(BreadcrumbItem).last().text()).toEqual('Request 123');
    expect(wrapper.find(BreadcrumbItem).last().props().isActive).toEqual(true);
    done();
  });

  it('should render request loader', async done => {
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/content`, mockOnce({ body: { params: { test: 'value' },
      product: 'Test product', order_id: '321', portfolio: 'TestPortfolio' }}));
    mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200, {
      data: {
        requests: []
      }
    });

    const store = mockStore(initialState);
    let wrapper;

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo" render={ props => <AllRequestDetail { ...props } { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    expect(wrapper.find(RequestLoader)).toHaveLength(1);
    done();
  });

  describe('actions', () => {
    const graphlQlData = {
      data: {
        requests: [
          {
            id: '123',
            name: 'Hello World',
            number_of_children: '0',
            decision: 'undecided',
            description: null,
            group_name: 'Test Approval Group',
            number_of_finished_children: '0',
            state: 'notified',
            actions: [
              { id: '1209', operation: 'start', comments: null, created_at: '2020-05-13T13:36:05.580Z', processed_by: 'system' },
              { id: '1211', operation: 'notify', comments: null, created_at: '2020-05-13T13:36:29.278Z', processed_by: 'system' }
            ],
            requests: []}
        ]
      }
    };
    const contentData = {
      params: {
        quest: 'Test Approval',
        airspeed: 3,
        username: 'insights-qa',
        int_value: 5
      },
      product: 'Hello World',
      order_id: '654',
      platform: 'Dev Public Ansible Tower (18.188.178.206)',
      portfolio: 'LGTestNoTags'
    };

    it('opens comment modal', async () => {
      const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
      registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
      const store = registry.getStore();

      apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/content`, mockOnce({ body: contentData }));
      mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200, graphlQlData);

      let wrapper;
      roles[APPROVAL_ADMINISTRATOR_ROLE] = true;

      await act(async() => {
        wrapper = mount(
          <UserContext.Provider value={ { userRoles: roles } }>
            <ComponentWrapper store={ store }>
              <AllRequestDetail { ...initialProps } />
            </ComponentWrapper>
          </UserContext.Provider>
        );
      });
      wrapper.update();

      await act(async() => {
        wrapper.find('#request-request-dropdown-123').first().simulate('click');
      });
      wrapper.update();
      await act(async() => {
        wrapper.find('Link#request-123-request-comment').first().simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.request.addComment);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?request=123');
      expect(wrapper.find(ActionModal).props().actionType).toEqual('Add Comment');
    });

    it('opens approve modal', async () => {
      const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
      registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
      const store = registry.getStore();

      apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/content`, mockOnce({ body: contentData }));
      mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200, graphlQlData);

      let wrapper;
      roles[APPROVAL_ADMINISTRATOR_ROLE] = true;

      await act(async() => {
        wrapper = mount(
          <UserContext.Provider value={ { userRoles: roles } }>
            <ComponentWrapper store={ store }>
              <AllRequestDetail { ...initialProps } />
            </ComponentWrapper>
          </UserContext.Provider>
        );
      });
      wrapper.update();

      await act(async() => {
        wrapper.find('a#approve-123').first().simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.request.approve);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?request=123');
      expect(wrapper.find(ActionModal).props().actionType).toEqual('Approve');
    });

    it('opens deny modal', async () => {
      const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
      registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
      const store = registry.getStore();

      apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/content`, mockOnce({ body: contentData }));
      mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200, graphlQlData);

      let wrapper;
      roles[APPROVAL_ADMINISTRATOR_ROLE] = true;

      await act(async() => {
        wrapper = mount(
          <UserContext.Provider value={ { userRoles: roles } }>
            <ComponentWrapper store={ store }>
              <AllRequestDetail { ...initialProps } />
            </ComponentWrapper>
          </UserContext.Provider>
        );
      });
      wrapper.update();

      await act(async() => {
        wrapper.find('a#deny-123').first().simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.request.deny);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?request=123');
      expect(wrapper.find(ActionModal).props().actionType).toEqual('Deny');
    });
  });
});
