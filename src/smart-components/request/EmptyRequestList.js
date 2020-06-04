import React, { Fragment, useContext } from 'react';
import { AddCircleOIcon } from '@patternfly/react-icons/dist/js/index';
import { isApprovalAdmin } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { AppTabs } from '../../smart-components/app-tabs/app-tabs';
import UserContext from '../../user-context';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';

const EmptyRequestList = () => {
  const { userRoles: userRoles } = useContext(UserContext);

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle title="Approval"/>
        { isApprovalAdmin(userRoles) && <AppTabs/> }
      </TopToolbar>
      <div className="pf-u-mt-xl">
        <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
          <EmptyStateIcon icon={ AddCircleOIcon } />
          <TextContent>
            <Text component={ TextVariants.h1 }>
                No requests yet
            </Text>
          </TextContent>
          <EmptyStateBody>
              Requests that need your attention will appear here.
          </EmptyStateBody>
        </EmptyState>
        <EmptyStateSecondaryActions>
        </EmptyStateSecondaryActions>
      </div>
    </Fragment>);
};

export default EmptyRequestList;
