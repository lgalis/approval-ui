import {
  CheckCircleIcon,
  InfoCircleIcon,
  ErrorCircleOIcon,
  ExclamationCircleIcon,
  OutlinedTimesCircleIcon
} from '@patternfly/react-icons';
import React from 'react';
import requestsMessages from '../messages/requests.messages';

export const APPROVAL_API_BASE = `${process.env.BASE_PATH}/approval/v1.2`;
export const RBAC_API_BASE = `${process.env.BASE_PATH}/rbac/v1`;

export const decisionValues = {
  undecided: { displayName: requestsMessages.needsReview, icon: <InfoCircleIcon className="pf-u-mr-sm icon-info-fill"/> },
  approved: { displayName: requestsMessages.approved, icon: <CheckCircleIcon className="pf-u-mr-sm icon-success-fill"/> },
  denied: { displayName: requestsMessages.denied, icon: <OutlinedTimesCircleIcon className="pf-u-mr-sm icon-danger-fill"/> },
  canceled: { displayName: requestsMessages.canceled, icon: <ErrorCircleOIcon className="pf-u-mr-sm icon-danger-fill"/> },
  error: { displayName: requestsMessages.error, icon: <ExclamationCircleIcon className="pf-u-mr-sm icon-danger-fill"/> }
};

// React intl does not support empty strings
export const untranslatedMessage = (defaultMessage = ' ') => ({ id: 'untranslated', defaultMessage });
export const APP_DISPLAY_NAME = {
  catalog: 'Automation Services Catalog',
  topology: 'Topological inventory'
};
