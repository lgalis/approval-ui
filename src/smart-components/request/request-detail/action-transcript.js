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
import { useIntl } from 'react-intl';
import commonMessages from '../../../messages/common.message';
import requestsMessages from '../../../messages/requests.messages';
import { untranslatedMessage } from '../../../utilities/constants';

const operationInfo = {
  memo: { displayName: requestsMessages.commentFrom, icon: <CommentIcon/> },
  approve: { displayName: requestsMessages.approvedBy, icon: <CheckCircleIcon className="pf-u-mr-0 icon-success-fill"/> },
  deny: { displayName: requestsMessages.deniedBy, icon: <OutlinedTimesCircleIcon className="pf-u-mr-sm icon-danger-fill"/> },
  notify: { displayName: requestsMessages.notifiedBy, icon: <EnvelopeIcon/> },
  skip: { displayName: requestsMessages.skippedBy, icon: <AngleDoubleRightIcon/> },
  start: { displayName: requestsMessages.startedBy, icon: <OnRunningIcon/> },
  cancel: { displayName: requestsMessages.canceledBy, icon: <ErrorCircleOIcon className="pf-u-mr-sm icon-danger-fill"/> },
  error: { displayName: requestsMessages.errorBy, icon: <ExclamationCircleIcon className="pf-u-mr-0 icon-danger-fill"/> }
};

const operationIcon = (operation) => operationInfo[operation] ? operationInfo[operation].icon : '';
const operationDisplayName = (operation) => operationInfo[operation] ? operationInfo[operation].displayName : untranslatedMessage();

export const ActionTranscript = actionList => {
  const intl = useIntl();
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
            { operationIcon(actionItem.operation) }&nbsp;
            { intl.formatMessage(operationDisplayName(actionItem.operation), { by: actionItem.processed_by }) }
          </Text>
          { actionItem.comments && <Text key={ `${actionItem.id}-action-comments` }
            className="pf-u-pt-0" component={ TextVariants.p }>
            { `${actionItem.comments}` }
          </Text> } </TextContent>
        </div>)
      }
    </Stack>
  ) : <EmptyTable centered aria-label={ intl.formatMessage(commonMessages.noRecords) }/>;
};
