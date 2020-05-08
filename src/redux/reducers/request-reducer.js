import {
  FETCH_REQUEST,
  FETCH_REQUEST_CONTENT,
  FETCH_REQUESTS,
  EXPAND_REQUEST
} from '../../redux/action-types';

// Initial State
export const requestsInitialState = {
  requests: {
    data: [],
    meta: {
      count: 0,
      limit: 10,
      offset: 0
    }
  },
  filterValue: '',
  isRequestDataLoading: false,
  expandedRequests: [],
  selectedRequest: {
    metadata: {
      user_capabilities: {}
    },
    requests: []
  }
};

const setLoadingState = state => ({ ...state, isRequestDataLoading: true, expandedRequests: []});
const setRequests = (state, { payload }) => ({ ...state, requests: payload, isRequestDataLoading: false });
const selectRequest = (state, { payload }) => ({ ...state, selectedRequest: payload, isRequestDataLoading: false });
const setRequestContent = (state, { payload }) => ({ ...state, requestContent: payload, isRequestDataLoading: false });
const setexpandRequest = (state, { payload }) => ({ ...state, expandedRequests: [ ...state.expandedRequests, payload ]});

export default {
  [`${FETCH_REQUESTS}_PENDING`]: setLoadingState,
  [`${FETCH_REQUESTS}_FULFILLED`]: setRequests,
  [`${FETCH_REQUEST}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST}_FULFILLED`]: selectRequest,
  [`${FETCH_REQUEST_CONTENT}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST_CONTENT}_FULFILLED`]: setRequestContent,
  [EXPAND_REQUEST]: setexpandRequest
};
