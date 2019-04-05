import {
  FETCH_RBAC_GROUPS
} from '../action-types';

// Initial State
export const rbacInitialState = {
  rbacGroups: [],
  isLoading: false
};

const setLoadingState = state => ({ ...state, isLoading: true });
const setRbacGroups = (state, { payload }) => ({ ...state, rbacGroups: payload, isLoading: false });

export default {
  [`${FETCH_RBAC_GROUPS}_PENDING`]: setLoadingState,
  [`${FETCH_RBAC_GROUPS}_FULFILLED`]: setRbacGroups
};
