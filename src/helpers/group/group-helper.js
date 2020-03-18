import { getRbacGroupApi, getAxiosInstance } from '../shared/user-login';
import { RBAC_API_BASE } from '../../utilities/constants';

const api = getRbacGroupApi();

export async function getRbacApprovalGroups() {
  return getAxiosInstance().get(`${RBAC_API_BASE}/groups/?role_names="Approval administrator,Approval user"`);
};

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
  .then((data) => data.name).catch((error) => {
    if (error.status !== 404) {
      throw error;
    } else {
      return id;
    }
  });

export const fetchFilterApprovalGroups = (filterValue) =>
  getAxiosInstance().get(`${RBAC_API_BASE}/groups/${filterValue.length > 0
    ? `?role_names="Approval administrator,Approval user"&name=${filterValue}`
    : ''}`)
  .then(({ data }) => data.map(({ uuid, name }) => ({ label: name, value: uuid })));

