import * as ActionTypes from '../action-types';
import * as WorkflowHelper from '../../helpers/workflow/workflow-helper';
import worfklowMessages from '../../messages/workflows.messages';

export const fetchWorkflows = (pagination) => (dispatch, getState) => {
  const { sortBy, workflows, filterValue } = getState().workflowReducer;

  let finalPagination = pagination;

  if (!pagination && workflows) {
    const { limit, offset } = workflows.meta;
    finalPagination = { limit, offset };
  }

  return dispatch ({
    type: ActionTypes.FETCH_WORKFLOWS,
    payload: WorkflowHelper.fetchWorkflows(filterValue, finalPagination, sortBy)
  });
};

export const fetchWorkflow = apiProps => ({
  type: ActionTypes.FETCH_WORKFLOW,
  payload: WorkflowHelper.fetchWorkflow(apiProps)
});

export const addWorkflow = (workflowData, intl) => ({
  type: ActionTypes.ADD_WORKFLOW,
  payload: WorkflowHelper.addWorkflow(workflowData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(worfklowMessages.addProcessSuccessTitle),
        description: intl.formatMessage(worfklowMessages.addProcessSuccessDescription)
      }
    }
  }
});

export const updateWorkflow = (workflowData, intl) => ({
  type: ActionTypes.UPDATE_WORKFLOW,
  payload: WorkflowHelper.updateWorkflow(workflowData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(worfklowMessages.updateProcessSuccessTitle),
        description: intl.formatMessage(worfklowMessages.updateProcessSuccessDescription)
      }
    }
  }
});

export const removeWorkflow = (workflow, intl) => ({
  type: ActionTypes.REMOVE_WORKFLOW,
  payload: WorkflowHelper.removeWorkflow(workflow),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(worfklowMessages.removeProcessSuccessTitle),
        description: intl.formatMessage(worfklowMessages.removeProcessSuccessDescription)
      }
    }
  }
});

export const removeWorkflows = (workflows, intl) => ({
  type: ActionTypes.REMOVE_WORKFLOWS,
  payload: WorkflowHelper.removeWorkflows(workflows),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: intl.formatMessage(worfklowMessages.removeProcessesSuccessTitle),
        description: intl.formatMessage(worfklowMessages.removeProcessesSuccessDescription)
      }
    }
  }
});

export const sortWorkflows = (sortBy) => ({
  type: ActionTypes.SORT_WORKFLOWS,
  payload: sortBy
});

export const setFilterValueWorkflows = (filterValue) => ({
  type: ActionTypes.SET_FILTER_WORKFLOWS,
  payload: filterValue
});

export const moveSequence = process => ({
  type: ActionTypes.MOVE_SEQUENCE,
  payload: process
});
