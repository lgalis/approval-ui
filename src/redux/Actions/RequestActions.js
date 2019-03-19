import * as ActionTypes from '../ActionTypes';
import * as RequestHelper from '../../Helpers/Request/RequestHelper';

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

