import {
  FETCH_REQUEST,
  FETCH_REQUESTS
} from '../../redux/ActionTypes';

// Initial State
export const usersInitialState = {
  users: [],
  user: {},
  filterValue: '',
  isRequestDataLoading: false
};

const setLoadingState = state => ({ ...state, isRequestDataLoading: true });
const setRequests = (state, { payload }) => ({ ...state, users: payload, isRequestDataLoading: false });
const selectRequest = (state, { payload }) => ({ ...state, selectedRequest: payload, isRequestDataLoading: false });

export default {
  [`${FETCH_REQUESTS}_PENDING`]: setLoadingState,
  [`${FETCH_REQUESTS}_FULFILLED`]: setRequests,
  [`${FETCH_REQUEST}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST}_FULFILLED`]: selectRequest
};
