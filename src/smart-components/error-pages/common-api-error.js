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
  '/401': 'Unauthorized'
};

const MESSAGES = {
  '/401': 'You are not auhtorized to access this section: '
};

const CommonApiError = () => {
  const {
    state: { from },
    pathname
  } = useLocation();

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
          { MESSAGES[pathname] } { from.pathname }. If you believe this is a
          mistake, please contact support.
        </EmptyStateBody>
        <EmptyStatePrimary>
          <Link to="/" >Return to approval</Link>
        </EmptyStatePrimary>
      </EmptyState>
    </Bullseye>
  );
};

export default CommonApiError;
