import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS,
  SORT_WORKFLOWS,
  SET_FILTER_WORKFLOWS,
  MOVE_SEQUENCE,
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

const tranformWf = (wf, id, sequence, isMovingUp) => {
  if (wf.id === id) {
    return { ...wf, sequence };
  }

  if (wf.sequence === sequence && isMovingUp) {
    return { ...wf, sequence: wf.sequence - 1 };
  }

  if (wf.sequence === sequence && !isMovingUp) {
    return { ...wf, sequence: wf.sequence + 1 };
  }

  return wf;
};

const moveSequence = (state, { payload }) => {
  const originalProcess = state.workflows.data.find(({ id }) => id === payload.id);

  const isMovingUp = payload?.sequence > originalProcess?.sequence;

  return ({
    ...state,
    workflows: {
      ...state.workflows,
      data: state.workflows.data
      .map(wf => tranformWf(wf, payload.id, payload.sequence, isMovingUp))
      .sort((a, b) => state.sortBy.direction === 'asc' ? a.sequence - b.sequence : b.sequence - a.sequence)
    }
  });
};

const setUpdatingWorkflow = (state) => ({
  ...state,
  isUpdating: state.isUpdating + 1
});
const finishUpdatingWorkflow = (state) => ({
  ...state,
  isUpdating: state.isUpdating - 1
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
  [MOVE_SEQUENCE]: moveSequence
};
