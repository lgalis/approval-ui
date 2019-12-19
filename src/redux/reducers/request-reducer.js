import {
  FETCH_REQUEST,
  FETCH_REQUEST_CONTENT,
  FETCH_REQUESTS
} from '../../redux/action-types';

// Initial State
export const requestsInitialState = {
  requests: [],
  selectedRequest: {},
  requestContent: {},
  filterValue: '',
  isRequestDataLoading: false
};

const setLoadingState = state => ({ ...state, isRequestDataLoading: true });
const setRequests = (state, { payload }) => ({ ...state, requests: payload, isRequestDataLoading: false });
const selectRequest = (state, { payload }) => ({ ...state, selectedRequest: payload, isRequestDataLoading: false });
const setRequestContent = (state, { payload }) => ({ ...state, requestContent: payload, isRequestDataLoading: false });

export default {
  [`${FETCH_REQUESTS}_PENDING`]: setLoadingState,
  [`${FETCH_REQUESTS}_FULFILLED`]: setRequests,
  [`${FETCH_REQUEST}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST}_FULFILLED`]: selectRequest,
  [`${FETCH_REQUEST_CONTENT}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST_CONTENT}_FULFILLED`]: setRequestContent
};
