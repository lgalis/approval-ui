import { getRbacGroupApi } from '../shared/user-login';

const api = getRbacGroupApi();

export async function getRbacGroups() {
  return await api.listGroups();
}

export async function fetchGroup(id) {
  return await api.getGroup(id);
}
