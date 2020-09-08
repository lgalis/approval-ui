import { getWorkflowApi, getTemplateApi, getAxiosInstance } from '../shared/user-login';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_API_BASE } from '../../utilities/constants';

const workflowApi = getWorkflowApi();
const templateApi = getTemplateApi();

export function fetchWorkflows(filter = '', pagination = defaultSettings, sortBy) {
  const paginationQuery = `&limit=${Math.max(pagination.limit, 10)}&offset=${pagination.offset}`;
  const filterQuery = `&filter[name][contains_i]=${filter}`;
  const sortQuery = sortBy ? `&sort_by=${sortBy.property}:${sortBy.direction}` : '';

  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/workflows/?${filterQuery}${paginationQuery}${sortQuery}`
  );
}

export const fetchWorkflow = (id) => workflowApi.showWorkflow(id);

export function fetchWorkflowByName(name) {
  return fetchWorkflows(name);
}

export function updateWorkflowOld(data) {
  return workflowApi.reposition(data.id, data);
}

export function updateWorkflow(data) {
  console.log('Debug - updateWorkflow: data', data);
  return workflowApi.reposition(data.id, data.sequence);
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

