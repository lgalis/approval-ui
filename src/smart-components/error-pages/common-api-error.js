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
import { useIntl } from 'react-intl';

import commonApiErrorMessages from '../../messages/common-api-error.messages';
import commonMessages from '../../messages/common.message';

const TITLES = {
  '/401': commonApiErrorMessages.unathorizedTitle,
  '/403': commonApiErrorMessages.forbiddenTitle
};

const MESSAGES = {
  '/401': commonApiErrorMessages.unathorizedDescription,
  '/403': commonApiErrorMessages.forbiddenDescription
};

const CommonApiError = () => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const history = useHistory();
  return (
    <Fragment>
      <TopToolbar className="pf-u-pb-md">
        <TopToolbarTitle title={ intl.formatMessage(commonMessages.approvalTitle) }/>
      </TopToolbar>
      <div className="pf-u-mb-xl">
        <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
          <div>
            <EmptyStateIcon icon={ LockIcon } />
          </div>
          <div>
            <Title headingLevel="h1" size="lg">{ intl.formatMessage(TITLES[pathname]) }</Title>
          </div>
          <EmptyStateBody>
            { intl.formatMessage(MESSAGES[pathname]) }
          </EmptyStateBody>
          <EmptyStatePrimary>
            {
              document.referrer ?
                <Button variant="primary" onClick={ () => history.goBack() }>{ intl.formatMessage(commonApiErrorMessages.returnBack) }</Button> :
                <Button variant="primary" component="a" href=".">{ intl.formatMessage(commonApiErrorMessages.goToLanding) }</Button>
            }
          </EmptyStatePrimary>
        </EmptyState>
      </div>
    </Fragment>
  );
};

export default CommonApiError;
