
import promiseMiddleware from 'redux-promise-middleware';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { notifications, notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import requestReducer, { requestsInitialState } from '../redux/reducers/request-reducer';
import workflowReducer, { workflowsInitialState } from '../redux/reducers/workflow-reducer';
import groupReducer, { groupsInitialState } from '../redux/reducers/group-reducer';

const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware(), notificationsMiddleware({
  errorTitleKey: [ 'message' ],
  errorDescriptionKey: [ 'errors', 'stack' ]
}), reduxLogger ]);

registry.register({
  requestReducer: applyReducerHash(requestReducer, requestsInitialState),
  workflowReducer: applyReducerHash(workflowReducer, workflowsInitialState),
  groupReducer: applyReducerHash(groupReducer, groupsInitialState),
  notifications
});

export default registry.getStore();
