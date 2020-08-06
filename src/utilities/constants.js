import {
  CheckCircleIcon,
  InfoCircleIcon,
  ErrorCircleOIcon,
  ExclamationCircleIcon
} from '@patternfly/react-icons';
import React from 'react';
import requestsMessages from '../messages/requests.messages';

export const APPROVAL_API_BASE = `${process.env.BASE_PATH}/approval/v1.2`;
export const RBAC_API_BASE = `${process.env.BASE_PATH}/rbac/v1`;

export const decisionValues = {
  undecided: { displayName: requestsMessages.needsReview, color: 'blue', icon: <InfoCircleIcon /> },
  approved: { displayName: requestsMessages.approved, color: 'green', icon: <CheckCircleIcon /> },
  denied: { displayName: requestsMessages.denied, color: 'red', icon: <ExclamationCircleIcon /> },
  canceled: { displayName: requestsMessages.canceled, color: 'red', icon: <ErrorCircleOIcon /> },
  error: { displayName: requestsMessages.error, color: 'red', icon: <ExclamationCircleIcon /> }
};

// React intl does not support empty strings
export const untranslatedMessage = (defaultMessage = ' ') => ({ id: 'untranslated', defaultMessage });
export const APP_DISPLAY_NAME = {
  catalog: 'Automation Services Catalog',
  topology: 'Topological inventory'
};
