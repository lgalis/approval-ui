import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS
} from '../../redux/ActionTypes';

// Initial State
export const workflowInitialState = {
  workflows: [],
  workflow: {},
  filterValue: '',
  isLoading: false
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setWorkflows = (state, { payload }) => ({ ...state, workflows: payload, isLoading: false });
const selectWorkflow = (state, { payload }) => ({ ...state, selectedWorkflow: payload, isLoading: false });

export default {
  [`${FETCH_WORKFLOWS}_PENDING`]: setLoadingState,
  [`${FETCH_WORKFLOWS}_FULFILLED`]: setWorkflows,
  [`${FETCH_WORKFLOW}_PENDING`]: setLoadingState,
  [`${FETCH_WORKFLOW}_FULFILLED`]: selectWorkflow
};
