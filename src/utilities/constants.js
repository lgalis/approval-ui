import {
  CheckCircleIcon,
  InfoCircleIcon,
  ErrorCircleOIcon, ExclamationCircleIcon,
  OutlinedTimesCircleIcon
} from '@patternfly/react-icons';
import React from 'react';

export const APPROVAL_API_BASE = `${process.env.BASE_PATH}/approval/v1.2`;
export const RBAC_API_BASE = `${process.env.BASE_PATH}/rbac/v1`;

export const decisionValues = {
  undecided: { displayName: 'Needs review', icon: <InfoCircleIcon className="pf-u-mr-sm icon-info-fill"/> },
  approved: { displayName: 'Approved', icon: <CheckCircleIcon className="pf-u-mr-sm icon-success-fill"/> },
  denied: { displayName: 'Denied', icon: <OutlinedTimesCircleIcon className="pf-u-mr-sm icon-danger-fill"/> },
  canceled: { displayName: 'Canceled', icon: <ErrorCircleOIcon className="pf-u-mr-sm icon-danger-fill"/> },
  error: { displayName: 'Error', icon: <ExclamationCircleIcon className="pf-u-mr-sm icon-danger-fill"/> }
};

