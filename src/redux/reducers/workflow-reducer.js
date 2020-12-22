import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS,
  SORT_WORKFLOWS,
  SET_FILTER_WORKFLOWS,
  CLEAR_FILTER_WORKFLOWS,
  UPDATE_WORKFLOW
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
  isUpdating: 0,
  sortBy: {
    index: 2,
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

const setUpdatingWorkflow = (state) => ({
  ...state,
  isUpdating: state.isUpdating + 1
});
const finishUpdatingWorkflow = (state) => ({
  ...state,
  isUpdating: state.isUpdating - 1
});

const clearFilterValue = (state) => ({
  ...state,
  filterValue: {}
});

export default {
  [`${FETCH_WORKFLOWS}_PENDING`]: setLoadingState,
  [`${FETCH_WORKFLOWS}_FULFILLED`]: setWorkflows,
  [`${FETCH_WORKFLOW}_PENDING`]: setRecordLoadingState,
  [`${FETCH_WORKFLOW}_FULFILLED`]: selectWorkflow,
  [`${UPDATE_WORKFLOW}_PENDING`]: setUpdatingWorkflow,
  [`${UPDATE_WORKFLOW}_FULFILLED`]: finishUpdatingWorkflow,
  [`${UPDATE_WORKFLOW}_REJECTED`]: finishUpdatingWorkflow,
  [SORT_WORKFLOWS]: setSortWorkflows,
  [SET_FILTER_WORKFLOWS]: setFilterValue,
  [CLEAR_FILTER_WORKFLOWS]: clearFilterValue
};
