
import { getWorkflowApi } from '../Shared/userLogin';

const workflowApi = getWorkflowApi();

export async function fetchWorkflows() {
  let workflowsData = await workflowApi.listWorkflows();
  let workflows = workflowsData.data;
  return Promise.all(workflows.map(async workflow => { let workflowWithRequests = await workflowApi.getWorkflow(workflow.uuid);
    return { ...workflow, members: workflowWithRequests.principals };}));
}

export async function updateWorkflow(data) {
  await workflowApi.updateWorkflow(data.uuid, data);
  const members_list = data.members.map(user => user.username);
  //update the user members here - adding users and removing users from the workflow should be a separate action in the UI
  let addRequests = data.user_list.filter(item => !members_list.includes(item.username));
  let removeRequests = members_list.filter(item => !(data.user_list.map(user => user.username).includes(item)));
  if (addRequests.length > 0) {
    await workflowApi.addPrincipalToWorkflow(data.uuid, { principals: addRequests });
  }

  if (removeRequests.length > 0) {
    await workflowApi.deletePrincipalFromWorkflow(data.uuid, removeRequests.join(','));
  }
}

export async function addWorkflow(data) {
  let newWorkflow = await workflowApi.createWorkflow(data);
  if (data.user_list && data.user_list.length > 0) {
    workflowApi.addPrincipalToWorkflow(newWorkflow.uuid, { principals: data.user_list });
  }
}

export async function removeWorkflow(workflowId) {
  await workflowApi.deleteWorkflow(workflowId);
}
