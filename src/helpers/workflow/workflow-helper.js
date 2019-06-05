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
    let wfWithGroups = [];
    try {
      wfWithGroups = await fetchGroupNames(wf.group_refs);
    }
    catch (error) {
      if (!(error.response && error.response.status === 404)) {
        throw error;
      }
    }

    return { ...wf, group_names: wfWithGroups };
  })).then(data => ({
    ...wfData,
    data
  }));
}

export async function fetchWorkflowWithGroups(id) {
  let wfData = await workflowApi.showWorkflow(id);
  let wfWithGroups = [];
  try {
    wfWithGroups = await fetchGroupNames(wfData.group_refs);
  }
  catch (error) {
    if (!(error.response && error.response.status === 404)) {
      throw error;
    }
  }

  return { ...wfData, group_names: wfWithGroups };
}

export async function fetchWorkflow(id) {
  return await workflowApi.showWorkflow(id);
}

export async function updateWorkflow(data) {
  return await workflowApi.updateWorkflow(data.id, data);
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
  return await workflowApi.destroyWorkflow(workflowId);
}

export async function removeWorkflows(selectedWorkflows) {
  return Promise.all(selectedWorkflows.map(async workflowId => await workflowApi.destroyWorkflow(workflowId)));
}

