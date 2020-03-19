import { getActionApi, getRequestApi, getAxiosInstance, getGraphqlInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

const requestApi = getRequestApi();
const actionApi = getActionApi();
const graphqlInstance = getGraphqlInstance();

export function fetchRequests(filter = '', pagination = defaultSettings, persona = undefined) {
  const paginationQuery = `&limit=${pagination.limit}&offset=${pagination.offset}`;
  const filterQuery = `filter[name][contains_i]=${filter}`;
  const fetchUrl = `${APPROVAL_API_BASE}/requests/?${filterQuery}${paginationQuery}`;
  const fetchHeaders = persona ? { 'x-rh-persona': persona } : undefined;
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
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
    group_name
    number_of_finished_children
    parent_id
    state
    workflow_id
  }
}`;

export const fetchRequestTranscript = (requestId, persona) => {
  const fetchHeaders = persona ? { 'x-rh-persona': persona } : undefined;
  return graphqlInstance({ method: 'post', url: `${APPROVAL_API_BASE}/graphql`,
    headers: fetchHeaders, data: { query: requestTranscriptQuery(requestId) }})
  .then(({ data: { requests }}) => requests);
};

export async function fetchRequest(id, persona) {
  return await requestApi.showRequest(id, { xRhPersona: persona });
}

export const fetchRequestActions = (id, persona) => {
  return actionApi.listActionsByRequest(id, { xRhPersona: persona });
};

export const fetchRequestContent = (id, persona) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}/content`;
  const fetchHeaders = persona ? { 'x-rh-persona': persona } : undefined;
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
};

export async function fetchRequestWithActions(id, persona = undefined) {
  let requestData = await requestApi.showRequest(id, { xRhPersona: persona });
  const requestActions = await fetchRequestActions(id);

  if (requestData.number_of_children > 0) {
    const subRequests = await requestApi.listRequestsByRequest(id, { xRhPersona: persona });
    const promises = subRequests.data.map(request => fetchRequestWithActions(request.id, { xRhPersona: persona }));
    const subRequestsWithActions = await Promise.all(promises);
    requestData = { ...requestData, children: subRequestsWithActions };
  }

  return  { ...requestData, actions: requestActions };
}

export async function fetchRequestWithSubrequests(id, persona = undefined) {
  let requestData = await requestApi.showRequest(id, { xRhPersona: persona });

  if (requestData.number_of_children > 0) {
    const subRequests = await fetchRequestTranscript(id, persona);
    requestData = { ...requestData, children: subRequests };
  } else {
    const requestActions = await fetchRequestActions(id, persona = undefined);
    requestData = { ...requestData, actions: requestActions ? requestActions.data : []};
  }

  return  { ...requestData };
}

export async function createRequestAction (requestId, actionIn) {
  return await actionApi.createAction(requestId, actionIn);
}
