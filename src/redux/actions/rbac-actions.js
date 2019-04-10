import { FETCH_RBAC_GROUPS } from '../action-types';
import { getRbacGroups } from '../../helpers/group/group-helper';

export const fetchRbacGroups = () => ({
  type: FETCH_RBAC_GROUPS,
  payload: getRbacGroups().then(({ data }) => [
    ...data.map(({ uuid, name }) => ({ value: uuid, label: name }))
  ])
});

