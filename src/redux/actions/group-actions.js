import { FETCH_RBAC_GROUPS } from '../action-types';
import * as GroupHelper from '../../helpers/group/group-helper';

export const fetchRbacApprovalGroups = () => ({
  type: FETCH_RBAC_GROUPS,
  payload: GroupHelper.fetchFilterApprovalGroups()
});
