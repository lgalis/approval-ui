import React from 'react';
import { timeAgo }  from '../../../helpers/shared/helpers';
import {
  Stack,
  StackItem,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';

export const ActionTrasncript = actionList => {
  return (
    <Stack>
      { Object.values(actionList)[0].map(actionItem =>
        <Stack key={ `${actionItem.id}-action` }>
          <StackItem style={ { textTransform: 'capitalize' } }>
            <TextContent><Text component={ TextVariants.small }>
              { `${timeAgo(actionItem.created_at)} by ${actionItem.processed_by}` }
            </Text></TextContent>
          </StackItem>
          <StackItem style={ { textTransform: 'capitalize' } }>
            { `${actionItem.comments}` }
          </StackItem>
        </Stack>)
      }
    </Stack>
  );
};
