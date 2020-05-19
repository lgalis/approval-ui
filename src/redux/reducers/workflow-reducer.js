import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS,
  EXPAND_WORKFLOW,
  SORT_WORKFLOWS
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
  expandedWorkflows: [],
  sortBy: {
    index: 4,
    property: 'sequence',
    direction: 'asc'
  }
};

const setLoadingState = state => ({ ...state, isLoading: true, expandedWorkflows: []});
const setRecordLoadingState = state => ({ ...state, isRecordLoading: true });
const setWorkflows = (state, { payload }) => ({ ...state, workflows: payload, isLoading: false });
const selectWorkflow = (state, { payload }) => ({ ...state, workflow: payload, isRecordLoading: false });
const expandWorkflow = (state, { payload }) => ({ ...state, expandedWorkflows: [ ...state.expandedWorkflows, payload ]});
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

export default {
  [`${FETCH_WORKFLOWS}_PENDING`]: setLoadingState,
  [`${FETCH_WORKFLOWS}_FULFILLED`]: setWorkflows,
  [`${FETCH_WORKFLOW}_PENDING`]: setRecordLoadingState,
  [`${FETCH_WORKFLOW}_FULFILLED`]: selectWorkflow,
  [EXPAND_WORKFLOW]: expandWorkflow,
  [SORT_WORKFLOWS]: setSortWorkflows
};
