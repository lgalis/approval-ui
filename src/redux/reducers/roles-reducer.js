import { SET_USER_ROLES } from '../action-types';
import { isApprovalAdmin } from '../../helpers/shared/helpers';

export const rolesInitialState = {
  userRoles: [],
  approvalAdmin: false
};
const setUserRoles = (state, { payload }) => ({ ...state, userRoles: payload, approvalAdmin: isApprovalAdmin(payload) });

export default {
  [SET_USER_ROLES]: setUserRoles
};
