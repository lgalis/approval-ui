import { getActionApi, getRequestApi, getAxiosInstance, getGraphqlInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

const requestApi = getRequestApi();
const actionApi = getActionApi();
const graphqlInstance = getGraphqlInstance();

export function fetchRequests(filter = '', pagination = defaultSettings, persona = 'approval/approver') {
  const paginationQuery = `&limit=${pagination.limit}&offset=${pagination.offset}`;
  const filterQuery = `&filter[name][contains_i]=${filter}`;
  return getAxiosInstance()({
    method: 'get',
    url: `${APPROVAL_API_BASE}/requests/?${filterQuery}${paginationQuery}`,
    headers: { 'x-rh-persona': persona }
  });
}

const requestTranscriptQuery = (parent_id) => `query {
  requests (filter: { parent_id: "${parent_id}" } ) {
    actions {
      id
      operation 
      comments 
      created_at 
      processed_by
    }
    id
    name
    number_of_children
    decision
    description
    group_name'
    number_of_finished_children
    parent_id
    state
    workflow_id
  }
}`;

export const fetchRequestTranscript = (requestId) => {
  return graphqlInstance
  .post(`${APPROVAL_API_BASE}/graphql`, { query: requestTranscriptQuery(requestId) })
  .then(({ data: { requests }}) => requests);
};

export async function fetchRequest(id) {
  return await requestApi.showRequest(id);
}

export const fetchRequestActions = (id) => {
  return actionApi.listActionsByRequest(id);
};

export const fetchRequestContent = (id) => {
  return getAxiosInstance().get(`${APPROVAL_API_BASE}/requests/${id}/content`);
};

export async function fetchRequestWithActions(id) {
  let requestData = await requestApi.showRequest(id);
  const requestActions = await fetchRequestActions(id);

  if (requestData.number_of_children > 0) {
    const subRequests = await requestApi.listRequestsByRequest(id);
    const promises = subRequests.data.map(request => fetchRequestWithActions(request.id));
    const subRequestsWithActions = await Promise.all(promises);
    requestData = { ...requestData, children: subRequestsWithActions };
  }

  return  { ...requestData, actions: requestActions };
}

export async function fetchRequestWithSubrequests(id) {
  let requestData = await requestApi.showRequest(id);

  if (requestData.number_of_children > 0) {
    const subRequests = await fetchRequestTranscript(id);
    requestData = { ...requestData, children: subRequests };
  } else {
    const requestActions = await fetchRequestActions(id);
    requestData = { ...requestData, actions: requestActions ? requestActions.data : []};
  }

  return  { ...requestData };
}

export async function createRequestAction (requestId, actionIn) {
  return await actionApi.createAction(requestId, actionIn);
}
