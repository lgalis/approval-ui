import React from 'react';
import { timeAgo }  from '../../../helpers/shared/helpers';
import {
  Stack,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import { CheckCircleIcon, CommentIcon, EnvelopeIcon, OutlinedTimesCircleIcon, AngleDoubleRightIcon, OnRunningIcon } from '@patternfly/react-icons';
const operationDisplayName = { memo: 'Comment from', approve: 'Approved by',
  deny: 'Denied by', notify: 'Notified by', skip: 'Skipped by', cancel: 'Canceled by', start: 'Started by' };

const operationIcon = {
  memo: <CommentIcon/>,
  approve: <CheckCircleIcon style={ { color: 'var(--pf-global--success-color--100)' } }/>,
  deny: <OutlinedTimesCircleIcon style={ { color: 'var(--pf-global--danger-color--100)' }	}/>,
  notify: <EnvelopeIcon/>,
  skip: <AngleDoubleRightIcon/>,
  start: <OnRunningIcon/>
};

export const ActionTranscript = actionList => {
  const actions = actionList.data || actionList.actionList.data;
  return (
    <Stack>
      { actions.map(actionItem =>
        <div key={ `${actionItem.id}-action` }>
          <TextContent><Text style={ { marginBottom: 0 } } className="data-table-detail content" component={ TextVariants.small }>
            { timeAgo(actionItem.created_at) }
          </Text>
          <Text style={ { marginBottom: 0 } } className="data-table-detail content">
            { operationIcon[actionItem.operation] } { `${operationDisplayName[actionItem.operation]}  ${actionItem.processed_by}` }
          </Text>
          { actionItem.comments && <Text style={ { marginBottom: 0 } } className="data-table-detail content" component={ TextVariants.h6 }>
            { `${actionItem.comments}` }
          </Text> } </TextContent>
          <br/>
        </div>)
      }
    </Stack>
  );
};
