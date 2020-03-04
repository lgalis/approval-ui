import * as ActionTypes from '../action-types';
import * as RequestHelper from '../../helpers/request/request-helper';

export const fetchRequests = (filter, pagination, persona) => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: RequestHelper.fetchRequests(filter, pagination, persona)
});

export const fetchRequest = (apiProps) => ({
  type: ActionTypes.FETCH_REQUEST,
  payload: RequestHelper.fetchRequestWithSubrequests(apiProps)
});

export const fetchRequestContent = (apiProps) => ({
  type: ActionTypes.FETCH_REQUEST_CONTENT,
  payload: RequestHelper.fetchRequestContent(apiProps)
});

export const createRequestAction = (actionName, requestId, actionIn) => ({
  type: ActionTypes.CREATE_REQUEST_ACTION,
  payload: RequestHelper.createRequestAction(requestId, actionIn),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success',
        description: `The ${actionName} was successful.`
      },
      rejected: {
        variant: 'danger',
        title: `${actionName} error`,
        description: `The ${actionName} action failed.`
      }
    }
  }
});

export const expandRequest = (id) => ({
  type: ActionTypes.EXPAND_REQUEST,
  payload: id
});
