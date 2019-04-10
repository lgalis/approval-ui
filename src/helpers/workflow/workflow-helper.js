import { getWorkflowApi, getTemplateApi } from '../shared/user-login';

const workflowApi = getWorkflowApi();
const templateApi = getTemplateApi();

export async function fetchWorkflows({ limit = 10, offset = 0 }) {
  return await workflowApi.listWorkflows(limit, offset);
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

