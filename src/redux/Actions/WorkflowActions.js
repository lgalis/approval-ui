import * as ActionTypes from '../ActionTypes';
import * as WorkflowHelper from '../../Helpers/Workflow/WorkflowHelper';

export const doFetchWorkflows = () => ({
  type: ActionTypes.FETCH_WORKFLOWS,
  payload: WorkflowHelper.fetchWorkflows().then(({ data }) => [ ...data ])
});

export const fetchWorkflows = apiProps => (dispatch, getState) => {
  const { workflowReducer: { isLoading }} = getState();
  if (!isLoading) {
    return dispatch(doFetchWorkflows(apiProps));
  }
};

export const addWorkflow = (workflowData) => ({
  type: ActionTypes.ADD_WORKFLOW,
  payload: WorkflowHelper.addWorkflow(workflowData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding workflow',
        description: 'The workflow was added successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed adding workflow',
        description: 'The workflow was not added successfuly.'
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
        title: 'Success updating workflow',
        description: 'The workflow was updated successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed updating workflow',
        description: 'The workflow was not updated successfuly.'
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
        title: 'Success removing workflow',
        description: 'The workflow was removed successfully.'
      }
    }
  }
});
