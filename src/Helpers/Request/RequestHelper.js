import { getRequesterApi } from '../Shared/userLogin';

const userApi = getUserApi();

export async function fetchRequests() {
  let requestData = await userApi.fetchRequests();
  let requests = requestData.data;
  return requests;
}

export async function updateRequest(data) {
  await userApi.updateRequest(data.id, data);
}

