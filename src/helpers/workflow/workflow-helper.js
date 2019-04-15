import { getWorkflowApi, getTemplateApi } from '../shared/user-login';
import { fetchGroupNames } from '../group/group-helper';

const workflowApi = getWorkflowApi();
const templateApi = getTemplateApi();

export async function fetchWorkflows({ limit = 10, offset = 0 }) {
  return await workflowApi.listWorkflows(limit, offset);
}

export async function fetchWorkflowsWithGroups({ limit = 10, offset = 0 }) {
  let wfData = await workflowApi.listWorkflows(limit, offset);
  let workflows = wfData.data;
  return Promise.all(workflows.map(async wf => {
    let wfWithGroups = await fetchGroupNames(wf.group_refs);
    return { ...wf, group_names: wfWithGroups };
  })).then(data => ({
    ...wfData,
    data
  }));
}

export async function fetchWorkflowWithGroups(id) {
  let wfData = await workflowApi.showWorkflow(id);
  let wfGroups = await fetchGroupNames(wfData.group_refs);
  return { ...wfData, group_names: wfGroups };
}

export async function fetchWorkflow(id) {
  return await workflowApi.showWorkflow(id);
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

