
import promiseMiddleware from 'redux-promise-middleware';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import rbacReducer, { rbacInitialState } from '../redux/reducers/rbac-reducer';
import { notifications, notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import reduxLogger from 'redux-logger';
import thunk from 'redux-thunk';
import requestReducer, { requestInitialState } from '../redux/reducers/request-reducer';
import workflowReducer, { workflowInitialState } from '../redux/reducers/workflow-reducer';

const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware(), notificationsMiddleware({
  errorTitleKey: [ 'message' ],
  errorDescriptionKey: [ 'errors', 'stack' ]
}), reduxLogger ]);

registry.register({
  requestReducer: applyReducerHash(requestReducer, requestInitialState),
  workflowReducer: applyReducerHash(workflowReducer, workflowInitialState),
  rbacReducer: applyReducerHash(rbacReducer, rbacInitialState),
  notifications
});

export default registry.getStore();
