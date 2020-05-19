import * as ActionTypes from '../action-types';
import * as WorkflowHelper from '../../helpers/workflow/workflow-helper';

export const fetchWorkflows = (filter, pagination) => (dispatch, getState) => {
  const { sortBy, workflows } = getState().workflowReducer;

  let finalPagination = pagination;

  if (!pagination && workflows) {
    const { limit, offset } = workflows.meta;
    finalPagination = { limit, offset };
  }

  return dispatch ({
    type: ActionTypes.FETCH_WORKFLOWS,
    payload: WorkflowHelper.fetchWorkflows(filter, finalPagination, sortBy)
  });
};

export const fetchWorkflow = apiProps => ({
  type: ActionTypes.FETCH_WORKFLOW,
  payload: WorkflowHelper.fetchWorkflow(apiProps)
});

export const addWorkflow = (workflowData) => ({
  type: ActionTypes.ADD_WORKFLOW,
  payload: WorkflowHelper.addWorkflow(workflowData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding approval process',
        description: 'The approval process was added successfully.'
      }
    }
  }
});

export const updateWorkflow = (workflowData) => ({
  type: ActionTypes.UPDATE_WORKFLOW,
  payload: WorkflowHelper.updateWorkflow(workflowData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success updating approval process',
        description: 'The approval process was updated successfully.'
      }
    }
  }
});

export const removeWorkflow = (workflow) => ({
  type: ActionTypes.REMOVE_WORKFLOW,
  payload: WorkflowHelper.removeWorkflow(workflow),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success removing approval process',
        description: 'The approval process was removed successfully.'
      }
    }
  }
});

export const removeWorkflows = (workflows) => ({
  type: ActionTypes.REMOVE_WORKFLOWS,
  payload: WorkflowHelper.removeWorkflows(workflows),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success removing approval processes',
        description: 'The selected approval processes were removed successfully.'
      }
    }
  }
});

export const expandWorkflow = (id) => ({
  type: ActionTypes.EXPAND_WORKFLOW,
  payload: id
});

export const refreshWorkflows = () => (dispatch, getState) => {
  const { workflowReducer: { filterValue, workflows: { meta: { limit, offset }}}} = getState();

  dispatch(fetchWorkflows(filterValue, { limit, offset }));
};

export const sortWorkflows = (sortBy) => ({
  type: ActionTypes.SORT_WORKFLOWS,
  payload: sortBy
});
