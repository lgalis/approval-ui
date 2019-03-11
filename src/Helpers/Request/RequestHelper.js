import { getPrincipalApi } from '../Shared/userLogin';

const principalApi = getPrincipalApi();

export async function fetchRequests() {
  let usersData = await principalApi.listPrincipals();
  let users = usersData.data;
  return users;
}

export async function updateRequest(data) {
  await principalApi.updateRequest(data.id, data);
}

