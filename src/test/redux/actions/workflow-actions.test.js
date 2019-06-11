import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';
import {
  FETCH_WORKFLOWS,
  FETCH_WORKFLOW
} from '../../../redux/action-types';
import {
  fetchWorkflows,
  fetchWorkflow
} from '../../../redux/actions/workflow-actions';
import {
  APPROVAL_API_BASE
} from '../../../utilities/constants';

describe('Workflow actions', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
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
      payload: { data: [{
        label: 'workflow',
        value: '11'
      }]},
      type: `${FETCH_WORKFLOWS}_FULFILLED`
    }];

    apiClientMock.get(APPROVAL_API_BASE + '/workflows?limit=10&offset=0', mockOnce({
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

    apiClientMock.get(APPROVAL_API_BASE + '/workflows?limit=10&offset=0', mockOnce({
      status: 500
    }));

    return store.dispatch(fetchWorkflows())
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch correct actions after fetching one workflow', () => {
    const store = mockStore({
      workflowReducer: {
        isLoading: false
      }
    });

    const expectedActions = [{
      type: `${FETCH_WORKFLOW}_PENDING`
    }, {
      payload: {
        data: [{
          id: '11',
          name: 'workflow'
        }]
      },
      type: `${FETCH_WORKFLOW}_FULFILLED`
    }];

    apiClientMock.get(APPROVAL_API_BASE + '/workflows/11', mockOnce({
      body: {
        data: [{
          id: '11',
          name: 'workflow'
        }]
      }
    }));

    return store.dispatch(fetchWorkflow(11)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
