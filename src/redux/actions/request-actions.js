import * as ActionTypes from '../action-types';
import * as RequestHelper from '../../helpers/request/request-helper';

export const fetchRequests = (options = {}) => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: RequestHelper.fetchRequests(options)
});

export const fetchRequest = (apiProps) => ({
  type: ActionTypes.FETCH_REQUEST,
  payload: RequestHelper.fetchRequestWithStagesAndActions(apiProps)
});

export const fetchStagesForRequest = apiProps => ({
  type: ActionTypes.FETCH_STAGES_FOR_REQUEST,
  payload: RequestHelper.fetchStagesForRequest(apiProps)
});

export const createStageAction = (actionName, stageId, actionIn) => ({
  type: ActionTypes.CREATE_STAGE_ACTION,
  payload: RequestHelper.createStageAction(stageId, actionIn),
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
