import { getUserApi } from '../Shared/userLogin';
import { APPROVAL_API_BASE } from '../../Utilities/Constants';

const userApi = getUserApi();

export function fetchRequests() {
  //return userApi.fetchRequests();
  return fetch(`${APPROVAL_API_BASE}/requests`).then(data => data.json());
}

export async function updateRequest(data) {
  await userApi.updateRequest(data.id, data);
}

