import * as ActionTypes from '../action-types';
import * as RequestHelper from '../../helpers/request/request-helper';

const doFetchRequests = (options = {}) => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: RequestHelper.fetchRequests(options)
});

export const fetchRequests = (options) => (dispatch, getState) => {
  const { requestReducer: { isLoading }} = getState();
  if (!isLoading) {
    return dispatch(doFetchRequests(options));
  }
};

