import React from 'react';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

const activeStates = [ 'notified' ];
export const APPROVAL_ADMINISTRATOR_ROLE = 'Approval Administrator';
export const APPROVAL_APPROVER_ROLE = 'Approval Approver';
export const APPROVAL_ADMIN_PERSONA = 'approval/admin';
export const APPROVAL_APPROVER_PERSONA = 'approval/approver';
export const APPROVAL_REQUESTER_PERSONA = 'approval/requester';

export const scrollToTop = () => document.getElementById('root').scrollTo({
  behavior: 'smooth',
  top: 0,
  left: 0
});

export const isRequestStateActive = (state) => activeStates.includes(state);

export const timeAgo = (date) => (
  <span key={ date }>
    <DateFormat date={ date } type="relative" />
  </span>
);

export const useIsApprovalAdmin = (roles = {}) => roles[APPROVAL_ADMINISTRATOR_ROLE];
export const useIsApprovalApprover = (roles = {}) => roles[APPROVAL_APPROVER_ROLE];

export const approvalPersona = (userRoles) => {
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  if (isApprovalAdmin) {
    return APPROVAL_ADMIN_PERSONA;
  } else if (isApprovalApprover) {
    return APPROVAL_APPROVER_PERSONA;
  }

  return APPROVAL_REQUESTER_PERSONA;
};

export const approvalRoles = (roles = []) => {
  const userRoles  = {};
  roles.forEach(role => {
    if (role.name === APPROVAL_ADMINISTRATOR_ROLE) {
      userRoles[APPROVAL_ADMINISTRATOR_ROLE] = true;
    } else if (role.name === APPROVAL_APPROVER_ROLE) {
      userRoles[APPROVAL_APPROVER_ROLE] = true;
    }
  });
  return userRoles;
};
