import { getActionApi, getRequestApi } from '../shared/user-login';

const requestApi = getRequestApi();
const actionApi = getActionApi();

export function fetchRequests({ limit, offset }) {
  return requestApi.listRequests(undefined, limit, offset);
}

export async function fetchRequest(id) {
  return await requestApi.showRequest(id);
}

export async function fetchRequestWithActions(id) {
  console.log('DEBUG - fetchRequestWithActions: id', id);
  const requestData = await requestApi.showRequest(id);
  console.log('DEBUG - fetchRequestWithActions: requestData', requestData);
  const requestActions = await actionApi.listActionsByRequest(id);
  console.log('DEBUG - fetchRequestWithActions: requestData', requestActions);
  return { ...requestData, actions: requestActions };
}

export async function createRequestAction (requestId, actionIn) {
  return await actionApi.createAction(requestId, actionIn);
}
