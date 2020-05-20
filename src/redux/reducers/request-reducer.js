import {
  FETCH_REQUEST,
  FETCH_REQUEST_CONTENT,
  FETCH_REQUESTS,
  EXPAND_REQUEST,
  SORT_REQUESTS,
  SET_FILTER_REQUESTS,
  CLEAR_FILTER_REQUESTS
} from '../../redux/action-types';

// Initial State
export const requestsInitialState = {
  requests: {
    data: [],
    meta: {
      count: 0,
      limit: 50,
      offset: 0
    }
  },
  filterValue: {},
  isRequestDataLoading: false,
  expandedRequests: [],
  selectedRequest: {
    metadata: {
      user_capabilities: {}
    },
    requests: []
  },
  sortBy: {
    direction: 'desc',
    property: 'opened',
    index: 3
  }
};

const setLoadingState = state => ({ ...state, isRequestDataLoading: true, expandedRequests: []});
const setRequests = (state, { payload }) => ({ ...state, requests: payload, isRequestDataLoading: false });
const selectRequest = (state, { payload }) => ({ ...state, selectedRequest: payload, isRequestDataLoading: false });
const setRequestContent = (state, { payload }) => ({ ...state, requestContent: payload, isRequestDataLoading: false });
const setexpandRequest = (state, { payload }) => ({ ...state, expandedRequests: [ ...state.expandedRequests, payload ]});
const setSortRequests = (state, { payload }) => ({
  ...state,
  sortBy: payload,
  requests: {
    ...state.requests,
    meta: {
      ...state.requests.meta,
      offset: 0
    }
  }
});
const setFilterValueRequests = (state, { payload }) => ({
  ...state,
  filterValue: {
    ...state.filterValue,
    [payload.type]: payload.filterValue
  }
});
const clearFilterValueRequests = (state) => ({
  ...state,
  filterValue: {}
});

export default {
  [`${FETCH_REQUESTS}_PENDING`]: setLoadingState,
  [`${FETCH_REQUESTS}_FULFILLED`]: setRequests,
  [`${FETCH_REQUEST}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST}_FULFILLED`]: selectRequest,
  [`${FETCH_REQUEST_CONTENT}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST_CONTENT}_FULFILLED`]: setRequestContent,
  [EXPAND_REQUEST]: setexpandRequest,
  [SORT_REQUESTS]: setSortRequests,
  [SET_FILTER_REQUESTS]: setFilterValueRequests,
  [CLEAR_FILTER_REQUESTS]: clearFilterValueRequests
};
