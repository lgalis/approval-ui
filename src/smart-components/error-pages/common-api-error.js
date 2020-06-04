import React, { Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Button,
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStatePrimary
} from '@patternfly/react-core';
import LockIcon from '@patternfly/react-icons/dist/js/icons/lock-icon';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';

const TITLES = {
  '/401': 'Unauthorized',
  '/403': 'You do not have access to Approval'
};

const MESSAGES = {
  '/401': 'You are not authorized to access this section: ',
  '/403': 'Contact your organization administrator for more information'
};

const CommonApiError = () => {
  const { pathname } = useLocation();
  const { history } = useHistory();
  return (
    <Fragment>
      <TopToolbar className="pf-u-pb-md">
        <TopToolbarTitle title="Approval"/>
      </TopToolbar>
      <div className="pf-u-mb-xl">
        <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
          <div>
            <EmptyStateIcon icon={ LockIcon } />
          </div>
          <div>
            <Title size="lg">{ TITLES[pathname] }</Title>
          </div>
          <EmptyStateBody>
            { MESSAGES[pathname] }
          </EmptyStateBody>
          <EmptyStatePrimary>
            {
              document.referrer ?
                <Button variant="primary" onClick={ () => history.back() }>Return to previous page</Button> :
                <Button variant="primary" component="a" href=".">Go to landing page</Button>
            }
          </EmptyStatePrimary>
        </EmptyState>
      </div>
    </Fragment>
  );
};

export default CommonApiError;
