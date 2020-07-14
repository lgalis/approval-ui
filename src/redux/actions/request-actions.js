import * as ActionTypes from '../action-types';
import * as RequestHelper from '../../helpers/request/request-helper';
import { defaultSettings } from '../../helpers/shared/pagination';
import actionModalMessages from '../../messages/action-modal.messages';

export const fetchRequests = (persona, pagination) => (dispatch, getState) => {
  const { sortBy, requests, filterValue } = getState().requestReducer;

  let finalPagination = pagination || defaultSettings;

  if (!pagination && requests) {
    const { limit, offset } = requests.meta;
    finalPagination = { limit, offset };
  }

  return dispatch({
    type: ActionTypes.FETCH_REQUESTS,
    payload: RequestHelper.fetchRequests(filterValue, finalPagination, persona, sortBy)
  });
};

export const fetchRequest = (apiProps, persona) => ({
  type: ActionTypes.FETCH_REQUEST,
  payload: RequestHelper.fetchRequestWithSubrequests(apiProps, persona)
});

export const fetchRequestContent = (apiProps, persona) => ({
  type: ActionTypes.FETCH_REQUEST_CONTENT,
  payload: RequestHelper.fetchRequestContent(apiProps, persona)
});

export const createRequestAction = (actionName, requestId, actionIn, intl) => ({
  type: ActionTypes.CREATE_REQUEST_ACTION,
  payload: RequestHelper.createRequestAction(requestId, actionIn),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(actionModalMessages.successTitle),
        description: intl.formatMessage(actionModalMessages.fulfilledAction, { actionName })
      },
      rejected: {
        variant: 'danger',
        title: intl.formatMessage(actionModalMessages.failedTitle, { actionName }),
        description: intl.formatMessage(actionModalMessages.failedAction, { actionName })
      }
    }
  }
});

export const expandRequest = (id) => ({
  type: ActionTypes.EXPAND_REQUEST,
  payload: id
});

export const sortRequests = (sortBy) => ({
  type: ActionTypes.SORT_REQUESTS,
  payload: sortBy
});

export const setFilterValueRequests = (filterValue, type) => ({
  type: ActionTypes.SET_FILTER_REQUESTS,
  payload: { filterValue, type }
});

export const clearFilterValueRequests = () => ({
  type: ActionTypes.CLEAR_FILTER_REQUESTS
});

export const resetRequestList = () => ({
  type: ActionTypes.RESET_REQUEST_LIST
});
