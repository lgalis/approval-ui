import {
  FETCH_WORKGROUP,
  FETCH_WORKGROUPS
} from '../../redux/ActionTypes';

// Initial State
export const workflowsInitialState = {
  workflows: [],
  workflow: {},
  filterValue: '',
  isLoading: false
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setWorkflows = (state, { payload }) => ({ ...state, workflows: payload, isLoading: false });
const selectWorkflow = (state, { payload }) => ({ ...state, selectedWorkflow: payload, isLoading: false });

export default {
  [`${FETCH_WORKGROUPS}_PENDING`]: setLoadingState,
  [`${FETCH_WORKGROUPS}_FULFILLED`]: setWorkflows,
  [`${FETCH_WORKGROUP}_PENDING`]: setLoadingState,
  [`${FETCH_WORKGROUP}_FULFILLED`]: selectWorkflow
};
