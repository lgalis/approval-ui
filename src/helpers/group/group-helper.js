import { getRbacGroupApi, getAxiosInstance } from '../shared/user-login';
import { RBAC_API_BASE } from '../../utilities/constants';

const api = getRbacGroupApi();

export async function getRbacGroups() {
  return await api.listGroups();
}

export async function fetchGroupNames(groupRefs) {
  if (groupRefs) {
    return Promise.all(groupRefs.map(async id => {
      const group = await api.getGroup(id);
      return group.name;
    }));
  }
}

export const fetchFilterGroups = (filterValue) =>
  getAxiosInstance().get(`${RBAC_API_BASE}/groups/${filterValue.length > 0
    ? `?name=${filterValue}`
    : ''}`)
  .then(({ data }) => data.map(({ uuid, name }) => ({ label: name, value: uuid })));

export async function fetchGroupOption(uuid) {
  const option = await api.getGroup(uuid);
  const group = await option;
  return { label: group ? group.name : uuid, value: uuid };
}
