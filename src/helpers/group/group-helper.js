import { getRbacGroupApi, getAxiosInstance } from '../shared/user-login';
import { RBAC_API_BASE } from '../../utilities/constants';

const api = getRbacGroupApi();

export async function getRbacGroups() {
  return await api.listGroups();
}

export async function fetchGroupNames(groupRefs) {
  if (groupRefs) {
    return Promise.all(groupRefs.map(async id => {
      try {
        const group = await api.getGroup(id);
        return group.name;
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
        else {
          return id;
        }
      }
    }));
  }
}

export const fetchGroupName = (id) =>
  getAxiosInstance().get(`${RBAC_API_BASE}/groups/${id}/`)
  .then((data) => { console.log('DEBUG', data); return data.name;});

export const fetchFilterGroups = (filterValue) =>
  getAxiosInstance().get(`${RBAC_API_BASE}/groups/${filterValue.length > 0
    ? `?name=${filterValue}`
    : ''}`)
  .then(({ data }) => data.map(({ uuid, name }) => ({ label: name, value: uuid })));

