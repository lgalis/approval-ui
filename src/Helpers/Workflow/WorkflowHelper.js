
import { getApprovalApi } from '../Shared/userLogin';
import { WorkflowIn } from 'approval_api_jsclient';
import { APPROVAL_API_BASE } from '../../Utilities/Constants';

const approvalApi = getApprovalApi();

export function fetchWorkflows() {
  //approvalApi.fetchWorkflows();
  return fetch(`${APPROVAL_API_BASE}/workflows`).then(data => data.json());
}

export async function updateWorkflow(data) {
  await approvalApi.updateWorkflow(data.id, data);
}

export async function addWorkflow(data) {
  let workflowIn = new WorkflowIn();
  await approvalApi.addWorkflow(data, workflowIn);
}

export async function removeWorkflow(workflowId) {
  await approvalApi.removeWorkflow(workflowId);
}
