import React from 'react';
import { useIntl } from 'react-intl';

import notFoundMessages from '../../messages/404-route.messages';

/**
 * Just a placeholder component. Will w8 for some designs.
 */
const NoMatch = () => {
  const intl = useIntl();

  return (
    <div>
      <h1>
        { intl.formatMessage(notFoundMessages.pageNotFound) }
      </h1>
    </div>
  );};

export default NoMatch;
