import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
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

describe('Request actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
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

    apiClientMock.get(APPROVAL_API_BASE + '/requests?limit=10&offset=0', mockOnce({
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

    apiClientMock.get(APPROVAL_API_BASE + '/requests?limit=10&offset=0 ', mockOnce({
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
        stages: [{ id: '10',
          name: 'stage',
          stageActions: {
            data: [
              {
                id: '9',
                name: 'action'
              }
            ]}
        }]
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

    apiClientMock.get(APPROVAL_API_BASE + '/requests/11/stages', mockOnce({
      body: {
        data: [{
          id: '10',
          name: 'stage'
        }]
      }
    }));

    apiClientMock.get(APPROVAL_API_BASE + '/stages/10/actions', mockOnce({
      body: {
        data: [{
          id: '9',
          name: 'action'
        }]
      }
    }));

    return store.dispatch(fetchRequest(11)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
