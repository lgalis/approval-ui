import { SET_USER_ROLES } from '../action-types';

export const rolesInitialState = {
  userRoles: []
};
const setUserRoles = (state, { payload }) => ({ ...state, userRoles: payload });

export default {
  [SET_USER_ROLES]: setUserRoles
};
