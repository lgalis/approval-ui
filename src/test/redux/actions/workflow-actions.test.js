import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import {
  FETCH_WORKFLOWS
} from '../../../redux/ActionTypes';
import {
  fetchWorkflows
} from '../../../redux/Actions/WorkflowActions';
import {
  APPROVAL_API_BASE
} from '../../../Utilities/Constants';

describe('Workflow actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should dispatch correct actions after fetching workflows', () => {
    const store = mockStore({
      workflowReducer: {
        isLoading: false
      }
    });

    const expectedActions = [{
      type: `${FETCH_WORKFLOWS}_PENDING`
    }, {
      payload: [{
        label: 'workflow',
        value: '11'
      }],
      type: `${FETCH_WORKFLOWS}_FULFILLED`
    }];

    apiClientMock.get(APPROVAL_API_BASE + '/workflows', mockOnce({
      body: {
        data: [{
          label: 'workflow',
          value: '11'
        }]
      }
    }));

    return store.dispatch(fetchWorkflows()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch error notification if fetch workflows fails', () => {
    const store = mockStore({
      workflowReducer: {
        isLoading: false
      }
    });

    const expectedActions = expect.arrayContaining([{
      type: `${FETCH_WORKFLOWS}_PENDING`
    },
    expect.objectContaining({
      type: ADD_NOTIFICATION,
      payload: expect.objectContaining({ variant: 'danger' })
    }),
    expect.objectContaining({
      type: `${FETCH_WORKFLOWS}_REJECTED`

    }) ]);

    apiClientMock.get(APPROVAL_API_BASE + '/workflows', mockOnce({
      status: 500
    }));

    return store.dispatch(fetchWorkflows())
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
