import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Bullseye,
  Button,
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStatePrimary
} from '@patternfly/react-core';
import LockIcon from '@patternfly/react-icons/dist/js/icons/lock-icon';

const TITLES = {
  '/401': 'Unauthorized',
  '/403': 'Forbidden'
};

const MESSAGES = {
  '/401': 'You are not authorized to access this section: ',
  '/403': 'You do not have access to Approval'
};

const CommonApiError = () => {
  const { state, pathname } = useLocation();
  const { history } = useHistory();
  return (
    <Bullseye className="global-primary-background">
      <EmptyState>
        <div>
          <EmptyStateIcon icon={ LockIcon } />
        </div>
        <div>
          <Title size="lg">{ TITLES[pathname] }</Title>
        </div>
        <EmptyStateBody>
          { MESSAGES[pathname] }
          <span>
            { state?.from?.pathname }
            { state?.from?.search }
          </span>
          <br />
          Contact your organization administrator for more information.
        </EmptyStateBody>
        <EmptyStatePrimary>
          {
            document.referrer ?
              <Button variant="primary" onClick={ () => history.back() }>Return to previous page</Button> :
              <Button variant="primary" component="a" href=".">Go to landing page</Button>
          }
        </EmptyStatePrimary>
      </EmptyState>
    </Bullseye>
  );
};

export default CommonApiError;
