import { getWorkflowApi, getTemplateApi, getAxiosInstance } from '../shared/user-login';
import { fetchGroupNames } from '../group/group-helper';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/constants';

const workflowApi = getWorkflowApi();
const templateApi = getTemplateApi();

export function fetchWorkflows(filter = '', pagination = defaultSettings) {
  const paginationQuery = `&limit=${pagination.limit}&offset=${pagination.offset}`;
  const filterQuery = `&filter[name][contains_i]=${filter}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/workflows/?${filterQuery}${paginationQuery}`
  );
}

export async function fetchWorkflowWithGroupNames(id) {
  const wfData = await workflowApi.showWorkflow(id);
  const  wfWithGroups = await fetchGroupNames(wfData.group_refs);
  return { ...wfData, group_names: wfWithGroups };
}

export async function fetchWorkflow(id) {
  return await workflowApi.showWorkflow(id);
}

export function updateWorkflow(data) {
  return workflowApi.updateWorkflow(data.id, data);
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

