import { getRbacGroupApi } from '../shared/user-login';

const api = getRbacGroupApi();

export async function getRbacGroups() {
  return await api.listGroups();
}

export async function fetchGroup(id) {
  return await api.getGroup(id);
}

export async function fetchGroupNames(groupRefs) {
  if (groupRefs) {
    return Promise.all(groupRefs.map(async id => {
      let group = await api.getGroup(id);
      return group.name;
    }));
  }
}

