import { getRbacGroupApi } from '../shared/user-login';

const api = getRbacGroupApi();

export async function getRbacGroups() {
  return await api.listGroups();
}
