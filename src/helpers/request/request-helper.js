import { getActionApi, getAxiosInstance, getGraphqlInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';
import { APPROVAL_REQUESTER_PERSONA, APPROVAL_APPROVER_PERSONA } from '../shared/helpers';

const actionApi = getActionApi();
const graphqlInstance = getGraphqlInstance();

const sortPropertiesMapper = (property) => ({
  'request-id': 'id',
  opened: 'created_at',
  requester: 'requester_name',
  status: 'state'
}[property] || property
);

const filterQuery = (filterValue) => {
  const query = [];
  if (filterValue.name) {
    query.push(`filter[name][contains_i]=${filterValue.name}`);
  }

  if (filterValue.requester) {
    query.push(`filter[requester_name][contains_i]=${filterValue.requester}`);
  }

  if (filterValue.status) {
    filterValue.status.forEach(state => {
      query.push(`filter[state][eq][]=${state}`);
    });
  }

  if (filterValue.decision) {
    filterValue.decision.forEach(dec => {
      query.push(`filter[decision][eq][]=${dec}`);
    });
  }

  return query.join('&');
};

export function fetchRequests(filter = {}, pagination = defaultSettings, persona = undefined, sortBy) {
  const paginationQuery = `&limit=${Math.max(pagination.limit, 10)}&offset=${pagination.offset}`;
  const sortQuery = `&sort_by=${sortPropertiesMapper(sortBy.property)}:${sortBy.direction}`;
  const fetchUrl = `${APPROVAL_API_BASE}/requests/?${filterQuery(filter)}${paginationQuery}${sortQuery}`;
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
  const fetchHeaders = (persona && persona !== APPROVAL_APPROVER_PERSONA) ? { 'x-rh-persona': persona }
    : { 'x-rh-persona': APPROVAL_REQUESTER_PERSONA };
  return graphqlInstance({ method: 'post', url: `${APPROVAL_API_BASE}/graphql`,
    headers: fetchHeaders, data: { query: requestTranscriptQuery(requestId) }})
  .then(({ data: { requests }}) => requests);
};

export const fetchRequestContent = (id) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}/content`;
  const fetchHeaders = { 'x-rh-persona': APPROVAL_REQUESTER_PERSONA };
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
};

export const fetchRequestCapabilities = (id, isParent) => {
  const fetchUrl = `${APPROVAL_API_BASE}/requests/${id}${isParent ? '/requests' : ''}`;
  const fetchHeaders = { 'x-rh-persona': APPROVAL_REQUESTER_PERSONA };
  return getAxiosInstance()({ method: 'get', url: fetchUrl, headers: fetchHeaders });
};

export async function fetchRequestWithSubrequests(id, persona) {
  const requestData = await fetchRequestTranscript(id, persona);

  if (!requestData || requestData.length === 0) { return {}; }

  if (persona === APPROVAL_APPROVER_PERSONA) {
    if (requestData && requestData.length > 0 && requestData[0].number_of_children > 0) {
      const result = await fetchRequestCapabilities(id, true);

      if (result && result.data) {
        requestData[0].requests = requestData[0].requests.map(request => {
          return {
            ...result.data.find((item) => (item.id === request.id) && item.metadata),
            ...request
          };
        });
      }
    }
    else {
      const request = await fetchRequestCapabilities(id, false);
      if (request) {
        requestData[0] = { ...requestData[0], metadata: request.metadata };
      }
    }
  }

  return requestData[0];
}

export const createRequestAction = (requestId, actionIn) => actionApi.createAction(requestId, actionIn);
