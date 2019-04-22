import * as ActionTypes from '../action-types';
import * as RequestHelper from '../../helpers/request/request-helper';

export const fetchRequests = (options = {}) => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: RequestHelper.fetchRequests(options)
});

export const fetchRequest = apiProps => ({
  type: ActionTypes.FETCH_REQUEST,
  payload: RequestHelper.fetchRequestWithStages(apiProps)
});

export const fetchStagesForRequest = apiProps => ({
  type: ActionTypes.FETCH_STAGES_FOR_REQUEST,
  payload: RequestHelper.fetchStagesForRequest(apiProps)
});

