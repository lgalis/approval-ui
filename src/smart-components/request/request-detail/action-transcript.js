import React from 'react';
import { timeAgo }  from '../../../helpers/shared/helpers';
import {
  Stack,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import { CheckCircleIcon,
  CommentIcon,
  EnvelopeIcon,
  OutlinedTimesCircleIcon,
  AngleDoubleRightIcon,
  OnRunningIcon,
  ErrorCircleOIcon,
  ExclamationCircleIcon } from '@patternfly/react-icons';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/components/cjs/EmptyTable';

const operationInfo = {
  memo: { displayName: 'Comment from', icon: <CommentIcon/> },
  approve: { displayName: 'Approved by', icon: <CheckCircleIcon className="pf-u-mr-sm icon-success-fill"/> },
  deny: { displayName: 'Denied by', icon: <OutlinedTimesCircleIcon className="pf-u-mr-sm icon-danger-fill"/> },
  notify: { displayName: 'Notified by', icon: <EnvelopeIcon/> },
  skip: { displayName: 'Skipped by', icon: <AngleDoubleRightIcon/> },
  start: { displayName: 'Started by', icon: <OnRunningIcon/> },
  cancel: { displayName: 'Canceled by', icon: <ErrorCircleOIcon className="pf-u-mr-sm icon-danger-fill"/> },
  error: { displayName: 'Error', icon: <ExclamationCircleIcon className="pf-u-mr-sm icon-danger-fill"/> }
};

const operationIcon = (operation) => operationInfo[operation] ? operationInfo[operation].icon : '';
const operationDisplayName = (operation) => operationInfo[operation] ? operationInfo[operation].displayName : '';

export const ActionTranscript = actionList => {
  const actions = actionList.actionList;
  return actions ? (
    <Stack>
      { actions.map(actionItem =>
        <div key={ `${actionItem.id}-action` }>
          <TextContent><Text key={ `${actionItem.id}-action-created_at` }
            className="pf-u-mb-0" component={ TextVariants.small }>
            { timeAgo(actionItem.created_at) }
          </Text>
          <Text key={ `${actionItem.id}-action-operation` }
            className="pf-u-mb-md">
            { operationIcon(actionItem.operation) } { `${operationDisplayName(actionItem.operation)}  ${actionItem.processed_by}` }
          </Text>
          { actionItem.comments && <Text key={ `${actionItem.id}-action-comments` }
            className="pf-u-pt-0" component={ TextVariants.p }>
            { `${actionItem.comments}` }
          </Text> } </TextContent>
        </div>)
      }
    </Stack>
  ) : <EmptyTable centered
    aria-label="No records"/>;
};
