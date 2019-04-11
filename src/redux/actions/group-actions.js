import { FETCH_RBAC_GROUPS, FETCH_GROUP } from '../action-types';
import { getRbacGroups, fetchGroup } from '../../helpers/group/group-helper';

export const fetchRbacGroups = () => ({
  type: FETCH_RBAC_GROUPS,
  payload: getRbacGroups().then(({ data }) => [
    ...data.map(({ uuid, name }) => ({ value: uuid, label: name }))
  ])
});

export const fetchRbacGroup = apiProps => ({
  type: FETCH_GROUP,
  payload: fetchGroup(apiProps)
});
