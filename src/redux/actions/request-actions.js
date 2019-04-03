import * as ActionTypes from '../action-types';
import * as RequestHelper from '../../helpers/request/request-helper';

const doFetchRequests = () => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: RequestHelper.fetchRequests().then(({ data }) => [ ...data ])
});

export const fetchRequests = () => (dispatch, getState) => {
  const { requestReducer: { isRequestDataLoading }} = getState();
  if (!isRequestDataLoading) {
    return dispatch(doFetchRequests());
  }
};

