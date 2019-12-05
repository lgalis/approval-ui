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
  const requestData = await requestApi.showRequest(id);
  const requestActions = [];
  return { ...requestData, actions: requestActions };
}

export async function createRequestAction (requestId, actionIn) {
  return await actionApi.createAction(requestId, actionIn);
}
