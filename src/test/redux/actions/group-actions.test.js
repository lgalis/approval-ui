import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { Workflow } from 'approval_api_jsclient';
import { notificationsMiddleware, ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import {
  ADD_WORKGROUP
} from '../../../redux/ActionTypes';
import {
  addWorkflow,
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

  it('should create correct action creators when adding workflow', () => {
    const store = mockStore({});
    apiClientMock.post(APPROVAL_API_BASE + '/workflows/', mockOnce({
      body: [{ data: {
        uuid: 'uuid',
        name: 'DemoWorkflow'
      }}]
    }));

    const expectedActions = [
      expect.objectContaining({ type: `${ADD_WORKGROUP}_PENDING` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'success' }) }),
      expect.objectContaining({ type: `${ADD_WORKGROUP}_FULFILLED` })
    ];

    return store.dispatch(addWorkflow({ data: { name: 'DemoWorkflow', description: 'desc' }}))
    .then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create error action creators when adding workflow failed', () => {
    const store = mockStore({});
    apiClientMock.post(APPROVAL_API_BASE + '/workflows/', mockOnce({
      status: 500
    }));

    const expectedActions = [
      expect.objectContaining({ type: `${ADD_WORKGROUP}_PENDING` }),
      expect.objectContaining({ type: ADD_NOTIFICATION, payload: expect.objectContaining({ variant: 'danger' }) }),
      expect.objectContaining({ type: `${ADD_WORKGROUP}_REJECTED` })
    ];

    return store.dispatch(addWorkflow({ data: { name: 'new workflow', description: 'new_desc' }}))
    .catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
