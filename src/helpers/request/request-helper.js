import { getRequestApi } from '../shared/user-login';

const requestApi = getRequestApi();

export function fetchRequests({ limit = 10, offset = 0 }) {
  return requestApi.listRequests(undefined, undefined, undefined, limit, offset);
}

export async function fetchRequest(id) {
  // TODO - remove ParseInt after the update json schema is merged and the jsclient libraries rebuilt
  return await requestApi.showRequest(parseInt(id, 10));
}
