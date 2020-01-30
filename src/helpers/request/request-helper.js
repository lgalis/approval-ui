import { getActionApi, getRequestApi, getAxiosInstance, getGraphqlInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

const requestApi = getRequestApi();
const actionApi = getActionApi();
const graphqlInstance = getGraphqlInstance();

export function fetchRequests(filter = '', pagination = defaultSettings) {
  const paginationQuery = `&limit=${pagination.limit}&offset=${pagination.offset}`;
  const filterQuery = `&filter[name][contains_i]=${filter}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/requests/?${filterQuery}${paginationQuery}`
  );
}

const requestTranscriptQuery = (parent_id) => ` 
query {
  requests (filter: { parent_id: ${parent_id}}) {
    id
    actions {
      operation 
      comments 
      created_at 
      processed_by
    }
    number_of_children
    decision
    description
    number_of_finished_children
    parent_id
  }
}`;

export const getRequestTranscript = (requestId) => {
  return graphqlInstance
  .post(`${APPROVAL_API_BASE}/graphql`, { query: requestTranscriptQuery(requestId) })
  .then(({ data: { requests }}) => requests)
  .then(([{ actions }]) => actions);
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

export async function createRequestAction (requestId, actionIn) {
  return await actionApi.createAction(requestId, actionIn);
}
