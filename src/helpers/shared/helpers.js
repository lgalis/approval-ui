import React from 'react';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/DateFormat';

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

export const getCurrentPage = (limit = 1, offset = 0) => Math.floor(offset / limit) + 1;

export const getNewPage = (page = 1, offset) => (page - 1) * offset;

export const isRequestStateActive = (state) => activeStates.includes(state);

export const timeAgo = (date) => (
  <span key={ date }>
    <DateFormat date={ date } type="relative" />
  </span>
);

export const isApprovalAdmin = (persona) => (persona === APPROVAL_ADMIN_PERSONA);
export const isApprovalApprover = (persona) => (persona === APPROVAL_ADMIN_PERSONA || persona === APPROVAL_APPROVER_PERSONA);

export const approvalPersona = (userRoles) => {
  if (userRoles && userRoles.find(role => role.name === APPROVAL_ADMINISTRATOR_ROLE) !== undefined) {
    return APPROVAL_ADMIN_PERSONA;
  } else if (userRoles && userRoles.find(role => role.name === APPROVAL_APPROVER_ROLE) !== undefined) {
    return APPROVAL_APPROVER_PERSONA;
  }

  return APPROVAL_REQUESTER_PERSONA;
};
