import { getActionApi, getAxiosInstance, getGraphqlInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

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
  requests(id: "${parent_id}") {
    id
    name
    number_of_children
    decision
    description
    group_name
    number_of_finished_children
    state
    actions {
      id
      operation
      comments
      created_at
      processed_by
    }
    requests {
      id
      name
      number_of_children
      decision
      description
      group_name
      number_of_finished_children
      state
      workflow_id
      parent_id
      actions {
        id
        operation
        comments
        created_at
        processed_by
      }
    }
  }
}`;

export const fetchRequestTranscript = (requestId, persona) => {
  const fetchHeaders = (persona && persona !== 'approval/approver') ? { 'x-rh-persona': persona } : { 'x-rh-persona': 'approval/requester' };
  return graphqlInstance({ method: 'post', url: `${APPROVAL_API_BASE}/graphql`,
    headers: fetchHeaders, data: { query: requestTranscriptQuery(requestId) }})
  .then(({ data: { requests }}) => requests);
};

export const fetchRequestContent = (id) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}/content`;
  const fetchHeaders = { 'x-rh-persona': 'approval/requester' };
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
};

export const fetchRequestCapabilities = (id, isParent) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}${isParent ? '/requests' : ''}`;
  const fetchHeaders = { 'x-rh-persona': 'approval/requester' };
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
};

export async function fetchRequestWithSubrequests(id, persona) {
  const requestData = await fetchRequestTranscript(id, persona);

  if (!requestData || requestData.length === 0) { return {}; }

  if (!persona || persona === 'approval/admin' || persona === 'approval/approver') {
    if (requestData && requestData.length > 0 && requestData[0].number_of_children > 0) {
      const result = await fetchRequestCapabilities(id, true);

      if (result && result.data) {
        requestData[0].requests = requestData[0].requests.map(request => {
          return { ...result.data.find((item) => (item.id === request.id) && item.metadata),
            ...request };
        });
        console.log('DEBUG - requestData with user_capabilities', requestData);
      }
    }
    else {
      const request = await fetchRequestCapabilities(id, false);
      if (request) {
        requestData[0] = { ...requestData[0], metadata: request.metadata };
      }
    }
  }

  return  { ...requestData[0] };
}

export async function createRequestAction (requestId, actionIn) {
  return await actionApi.createAction(requestId, actionIn);
}
