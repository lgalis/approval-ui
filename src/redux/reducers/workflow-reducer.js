import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS,
  SORT_WORKFLOWS,
  SET_FILTER_WORKFLOWS
} from '../../redux/action-types';

// Initial State
export const workflowsInitialState = {
  workflows: {
    data: [],
    meta: {
      count: 0,
      limit: 50,
      offset: 0
    }
  },
  workflow: {},
  filterValue: '',
  isLoading: false,
  isRecordLoading: false,
  sortBy: {
    index: 4,
    property: 'sequence',
    direction: 'asc'
  }
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setRecordLoadingState = state => ({ ...state, isRecordLoading: true });
const setWorkflows = (state, { payload }) => ({ ...state, workflows: payload, isLoading: false });
const selectWorkflow = (state, { payload }) => ({ ...state, workflow: payload, isRecordLoading: false });
const setSortWorkflows = (state, { payload }) => ({
  ...state,
  sortBy: payload,
  workflows: {
    ...state.workflows,
    meta: {
      ...state.workflows.meta,
      offset: 0
    }
  }
});
const setFilterValue = (state, { payload }) => ({
  ...state,
  filterValue: payload,
  workflows: {
    ...state.workflows,
    meta: {
      ...state.workflows.meta,
      offset: 0
    }
  }
});

export default {
  [`${FETCH_WORKFLOWS}_PENDING`]: setLoadingState,
  [`${FETCH_WORKFLOWS}_FULFILLED`]: setWorkflows,
  [`${FETCH_WORKFLOW}_PENDING`]: setRecordLoadingState,
  [`${FETCH_WORKFLOW}_FULFILLED`]: selectWorkflow,
  [SORT_WORKFLOWS]: setSortWorkflows,
  [SET_FILTER_WORKFLOWS]: setFilterValue
};
