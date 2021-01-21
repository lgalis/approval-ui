import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/redux';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import {
  FETCH_REQUESTS,
  FETCH_REQUEST
} from '../../../redux/action-types';
import {
  fetchRequests,
  fetchRequest
} from '../../../redux/actions/request-actions';
import {
  APPROVAL_API_BASE
} from '../../../utilities/constants';
import { mockGraphql } from '../../__mocks__/user-login';

describe('Request actions', () => {
  const middlewares = [ thunk, promiseMiddleware, notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching requests', () => {
    const store = mockStore({
      requestReducer: {
        isLoading: false,
        sortBy: {
          index: 1,
          property: 'name',
          direction: 'desc'
        },
        filterValue: {
          name: 'some-name'
        }
      }
    });

    const expectedActions = [{
      type: `${FETCH_REQUESTS}_PENDING`
    }, {
      payload: { data: [{
        label: 'request',
        value: '11'
      }]},
      type: `${FETCH_REQUESTS}_FULFILLED`
    }];
    apiClientMock.get(
      APPROVAL_API_BASE + '/requests/?filter%5Bname%5D%5Bcontains_i%5D=some-name&limit=10&offset=0&sort_by=name%3Adesc',
      mockOnce({
        body: {
          data: [{
            label: 'request',
            value: '11'
          }]
        }
      })
    );

    return store.dispatch(fetchRequests(undefined, { limit: 10, offset: 0 })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch error notification if fetch requests fails', () => {
    const store = mockStore({
      requestReducer: {
        isLoading: false,
        sortBy: {
          index: 1,
          property: 'name',
          direction: 'desc'
        }
      }
    });

    const expectedActions = expect.arrayContaining([{
      type: `${FETCH_REQUESTS}_PENDING`
    },
    expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({ variant: 'danger' })
    }),
    expect.objectContaining({
      type: `${FETCH_REQUESTS}_REJECTED`

    }) ]);

    apiClientMock.get(APPROVAL_API_BASE + '/requests/?limit=50&offset=0&sort_by=name%3Adesc', mockOnce({
      status: 500
    }));

    return store.dispatch(fetchRequests())
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching one request', () => {
    const store = mockStore({
      requestReducer: {
        isRequestDataLoading: false
      }
    });

    apiClientMock.get(APPROVAL_API_BASE + '/requests/?limit=50&offset=0', mockOnce({
      body: {
        data: [{
          id: '111',
          name: ''
        }]
      }
    }));

    apiClientMock.get(APPROVAL_API_BASE + '/requests/111/requests', mockOnce({
      body: {
        data: [{
          id: '123',
          name: ''
        }]
      }
    }));
    const expectedData = [{
      type: `${FETCH_REQUEST}_PENDING`
    }, {
      payload:
            {
              id: '123',
              name: 'Hello World',
              number_of_children: '3',
              decision: 'undecided',
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
            },
      type: `${FETCH_REQUEST}_FULFILLED`
    }];

    apiClientMock.get(APPROVAL_API_BASE + '/requests/111', mockOnce({
      body: {
        data: {
          id: '111',
          state: 'notified',
          decision: 'undecided',
          created_at: '2020-01-29T16:55:03Z',
          notified_at: '2020-01-29T17:09:15Z',
          number_of_children: 3,
          number_of_finished_children: 0,
          owner: 'test',
          requester_name: 'Test User',
          name: 'Hello World',
          group_name: 'GroupA'
        }
      }
    }));

    mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200, {
      data: {
        requests: [
          {
            id: '123',
            name: 'Hello World',
            number_of_children: '3',
            decision: 'undecided',
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
        ]
      }
    });

    return store.dispatch(fetchRequest(111)).then(() => {
      expect(store.getActions()).toEqual(expectedData);
    });
  });
});
