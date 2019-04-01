
import { getWorkflowApi, getTemplateApi } from '../Shared/userLogin';

const workflowApi = getWorkflowApi();
const templateApi = getTemplateApi();

export function fetchWorkflows() {
  return workflowApi.listWorkflows();
}

export async function updateWorkflow(data) {
  await workflowApi.updateWorkflow(data.id, data);
}

export  function addWorkflow(workflow) {
  return templateApi.listTemplates().then(({ data }) => {
    // workaround for v1. Need to pass template ID with the workflow. Assigning to first template
    if (!data[0]) {
      throw new Error('No template exists');
    }

    return data[0].id;

  }).then(id => workflowApi.addWorkflowToTemplate(id, workflow, {}));
}

export async function removeWorkflow(workflowId) {
  await workflowApi.destroyWorkflow(workflowId);
}
