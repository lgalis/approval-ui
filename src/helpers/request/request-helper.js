import { getRequestApi } from '../shared/user-login';

const requestApi = getRequestApi();

export function fetchRequests({ limit = 10, offset = 0 }) {
  return requestApi.listRequests(undefined, undefined, undefined, limit, offset);
}
