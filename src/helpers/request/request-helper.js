import { getActionApi, getRequestApi, getAxiosInstance } from '../shared/user-login';
import { APPROVAL_API_BASE } from '../../utilities/constants';
import { defaultSettings } from '../shared/pagination';

const requestApi = getRequestApi();
const actionApi = getActionApi();

export function fetchRequests(pagination = { limit: defaultSettings.limit, offset: defaultSettings.offset },
  filter = '') {
  const paginationQuery = `&limit=${pagination.limit}&offset=${pagination.offset}`;
  const filterQuery = `&filter[name][contains]=${filter}`;
  return getAxiosInstance().get(
    `${APPROVAL_API_BASE}/requests/?${filterQuery}${paginationQuery}`
  );
}

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
