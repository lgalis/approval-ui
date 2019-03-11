import * as ActionTypes from '../ActionTypes';
import * as WorkflowHelper from '../../Helpers/Workflow/WorkflowHelper';

export const doFetchWorkflows = apiProps => ({
  type: ActionTypes.FETCH_WORKGROUPS,
  payload: new Promise(resolve => {
    resolve(WorkflowHelper.fetchWorkflows(apiProps));
  })
});

export const fetchWorkflows = apiProps => (dispatch, getState) => {
  const { workflowReducer: { isLoading }} = getState();
  if (!isLoading) {
    return dispatch(doFetchWorkflows(apiProps));
  }
};

export const fetchRequestsByWorkflowId = apiProps => ({
  type: ActionTypes.FETCH_REQUESTS_BY_WORKGROUP_ID,
  payload: new Promise(resolve => {
    resolve(WorkflowHelper.fetchRequestsByWorkflowId(apiProps));
  })
});

export const addWorkflow = (workflowData) => ({
  type: ActionTypes.ADD_WORKGROUP,
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

export const addToWorkflow = (workflowId, items) => ({
  type: ActionTypes.ADD_TO_WORKGROUP,
  payload: WorkflowHelper.addToWorkflow(workflowId, items),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding users',
        description: 'Requests were successfully added to workflow.'
      }
    }
  }
});

export const updateWorkflow = (workflowData) => ({
  type: ActionTypes.UPDATE_WORKGROUP,
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
  type: ActionTypes.REMOVE_WORKGROUP,
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
