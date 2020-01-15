import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';
import {
  FETCH_REQUESTS,
  FETCH_REQUEST,
  CREATE_REQUEST_ACTION
} from '../../../redux/action-types';
import {
  createRequestAction,
  fetchRequests,
  fetchRequest
} from '../../../redux/actions/request-actions';
import {
  APPROVAL_API_BASE
} from '../../../utilities/constants';

describe('Request actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  it('should dispatch correct actions after fetching requests', () => {
    const store = mockStore({
      requestReducer: {
        isLoading: false
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
    apiClientMock.get(APPROVAL_API_BASE + '/requests/?filter%5Bname%5D%5Bcontains%5D=&limit=10&offset=0', mockOnce({
      body: {
        data: [{
          label: 'request',
          value: '11'
        }]
      }
    }));

    return store.dispatch(fetchRequests({ limit: 10, offset: 0 })).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch error notification if fetch requests fails', () => {
    const store = mockStore({
      requestReducer: {
        isLoading: false
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

    apiClientMock.get(APPROVAL_API_BASE + '/requests', mockOnce({
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

    const expectedActions = [{
      type: `${FETCH_REQUEST}_PENDING`
    }, {
      payload: {
        data: [{
          id: '11',
          name: 'request' }],
        actions: {
          data: [
            {
              id: '11',
              name: 'action'
            }
          ]}
      },
      type: `${FETCH_REQUEST}_FULFILLED`
    }];

    apiClientMock.get(APPROVAL_API_BASE + '/requests/11', mockOnce({
      body: {
        data: [{
          id: '11',
          name: 'request'
        }]
      }
    }));

    apiClientMock.get(APPROVAL_API_BASE + '/requests/11/requests', mockOnce({
      body: {
        data: [{
          id: '10',
          name: 'subrequest'
        }]
      }
    }));

    apiClientMock.get(APPROVAL_API_BASE + '/requests/11/actions', mockOnce({
      body: {
        data: [{
          id: '11',
          name: 'action'
        }]
      }
    }));

    return store.dispatch(fetchRequest(11)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('createRequestAction should create correct actions on success ', (done) => {
    expect.assertions(2);
    const store = mockStore({});

    apiClientMock.post(`${APPROVAL_API_BASE}/requests/123/actions`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual('actionIn');
      return res.status(200).body({ foo: 'bar' });
    }));

    const expectedActions = [{
      type: `${CREATE_REQUEST_ACTION}_PENDING`,
      meta: expect.any(Object)
    }, {
      type: ADD_NOTIFICATION,
      payload: {
        description: 'The actionName was successful.',
        dismissDelay: 5000,
        dismissable: true,
        title: 'Success',
        variant: 'success'
      }
    }, {
      type: `${CREATE_REQUEST_ACTION}_FULFILLED`,
      meta: expect.any(Object),
      payload: { foo: 'bar' }
    }];

    store.dispatch(createRequestAction('actionName', '123', 'actionIn')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });

  it('createRequestAction should create correct actions when failed ', (done) => {
    expect.assertions(2);
    const store = mockStore({});

    apiClientMock.post(`${APPROVAL_API_BASE}/requests/123/actions`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual('actionIn');
      return res.status(500);
    }));

    const expectedActions = [{
      type: `${CREATE_REQUEST_ACTION}_PENDING`,
      meta: expect.any(Object)
    }, {
      type: ADD_NOTIFICATION,
      payload: {
        description: 'The actionName action failed.',
        dismissDelay: 5000,
        dismissable: true,
        title: 'actionName error',
        variant: 'danger'

      }
    }, expect.objectContaining({
      type: `${CREATE_REQUEST_ACTION}_REJECTED`
    }) ];

    store.dispatch(createRequestAction('actionName', '123', 'actionIn')).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
