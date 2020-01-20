import {
  FETCH_REQUEST,
  FETCH_REQUEST_CONTENT,
  FETCH_REQUESTS,
  OPEN_REQUEST
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
  openedRequests: []
};

const setLoadingState = state => ({ ...state, isRequestDataLoading: true, openedRequests: []});
const setRequests = (state, { payload }) => ({ ...state, requests: payload, isRequestDataLoading: false });
const selectRequest = (state, { payload }) => ({ ...state, selectedRequest: payload, isRequestDataLoading: false });
const setRequestContent = (state, { payload }) => ({ ...state, requestContent: payload, isRequestDataLoading: false });
const setOpenRequest = (state, { payload }) => ({ ...state, openedRequests: [ ...state.openedRequests, payload ]});

export default {
  [`${FETCH_REQUESTS}_PENDING`]: setLoadingState,
  [`${FETCH_REQUESTS}_FULFILLED`]: setRequests,
  [`${FETCH_REQUEST}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST}_FULFILLED`]: selectRequest,
  [`${FETCH_REQUEST_CONTENT}_PENDING`]: setLoadingState,
  [`${FETCH_REQUEST_CONTENT}_FULFILLED`]: setRequestContent,
  [OPEN_REQUEST]: setOpenRequest
};
