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
  return (
    <Stack>
      { actions.map(actionItem =>
        <div key={ `${actionItem.id}-action` }>
          <TextContent><Text key={ `${actionItem.id}-action-created_at` } style={ { marginBottom: 0 } }
            className="data-table-detail content" component={ TextVariants.small }>
            { timeAgo(actionItem.created_at) }
          </Text>
          <Text key={ `${actionItem.id}-action-operation` }  style={ { marginBottom: 0 } }
            className="data-table-detail content">
            { operationIcon(actionItem.operation) } { `${operationDisplayName(actionItem.operation)}  ${actionItem.processed_by}` }
          </Text>
          { actionItem.comments && <Text key={ `${actionItem.id}-action-comments` } style={ { marginBottom: 0 } }
            className="data-table-detail content" component={ TextVariants.h6 }>
            { `${actionItem.comments}` }
          </Text> } </TextContent>
          <br/>
        </div>)
      }
    </Stack>
  );
};
