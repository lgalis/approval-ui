import { getRequestApi } from '../shared/user-login';

const requestApi = getRequestApi();

export function fetchRequests() {
  return requestApi.listRequests();
}

export async function updateRequest(data) {
  await requestApi.updateRequest(data.id, data);
}

