import React from 'react';
import { timeAgo }  from '../../../helpers/shared/helpers';
import {
  Stack,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import { CheckCircleIcon, CommentIcon, EnvelopeIcon, OutlinedTimesCircleIcon, AngleDoubleRightIcon } from '@patternfly/react-icons';

const operationDisplayName = { memo: 'Comment from', approve: 'Approved By',
  deny: 'Denied by', notify: 'Notified By', skip: 'Skipped by' };

const operationIcon = {
  memo: <CommentIcon/>,
  approve: <CheckCircleIcon style={ { color: 'var(--pf-global--success-color--100)' } }/>,
  deny: <OutlinedTimesCircleIcon style={ { color: 'var(--pf-global--danger-color--100)' }	}/>,
  notify: <EnvelopeIcon/>,
  skip: <AngleDoubleRightIcon/>
};

export const ActionTranscript = actionList => {
  return (
    <Stack>
      { actionList.actionList.map(actionItem =>
        <div key={ `${actionItem.id}-action` }>
          <TextContent><Text style={ { marginBottom: 0 } } className="data-table-detail content" component={ TextVariants.small }>
            { `${timeAgo(actionItem.created_at)}` }
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
