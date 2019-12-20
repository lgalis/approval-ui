import { FETCH_RBAC_GROUPS } from '../action-types';
import * as GroupHelper from '../../helpers/group/group-helper';

export const fetchRbacGroups = () => ({
  type: FETCH_RBAC_GROUPS,
  payload: GroupHelper.getRbacGroups().then(({ data }) => [
    ...data.map(({ uuid, name }) => ({ value: uuid, label: name }))
  ])
});
