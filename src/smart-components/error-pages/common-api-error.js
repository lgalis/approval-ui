import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bullseye,
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStatePrimary
} from '@patternfly/react-core';
import Exclamation from '@patternfly/react-icons/dist/js/icons/exclamation-icon';

const TITLES = {
  '/401': 'Unauthorized',
  '/403': 'Forbidden'
};

const MESSAGES = {
  '/401': 'You are not authorized to access this section: ',
  '/403': 'You are not authorized to access this section: '
};

const CommonApiError = () => {
  const { state, pathname } = useLocation();

  return (
    <Bullseye className="global-primary-background">
      <EmptyState>
        <div>
          <EmptyStateIcon icon={ Exclamation } />
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
          If you believe this is a mistake, please contact support.
        </EmptyStateBody>
        <EmptyStatePrimary>
          <Link to="/" >Return to approval</Link>
        </EmptyStatePrimary>
      </EmptyState>
    </Bullseye>
  );
};

export default CommonApiError;
