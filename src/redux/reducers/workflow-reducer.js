import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS
} from '../../redux/action-types';

// Initial State
export const workflowsInitialState = {
  workflows: {
    data: [],
    meta: {
      count: 0,
      limit: 10,
      offset: 0
    }
  },
  workflow: {},
  filterValue: '',
  isLoading: false,
  isRecordLoading: false
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setRecordLoadingState = state => ({ ...state, isRecordLoading: true });
const setWorkflows = (state, { payload }) => ({ ...state, workflows: payload, isLoading: false });
const selectWorkflow = (state, { payload }) => ({ ...state, workflow: payload, isRecordLoading: false });

export default {
  [`${FETCH_WORKFLOWS}_PENDING`]: setLoadingState,
  [`${FETCH_WORKFLOWS}_FULFILLED`]: setWorkflows,
  [`${FETCH_WORKFLOW}_PENDING`]: setRecordLoadingState,
  [`${FETCH_WORKFLOW}_FULFILLED`]: selectWorkflow
};
