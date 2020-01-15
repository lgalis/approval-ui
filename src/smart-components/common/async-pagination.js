import React from 'react';
import PropTypes from 'prop-types';
import debouncePromise from 'awesome-debounce-promise';

import { Pagination } from '@patternfly/react-core';

import { getCurrentPage, getNewPage } from '../../helpers/shared/pagination';

const AsyncPagination = ({
  meta: { limit, count, offset },
  apiProps,
  apiRequest,
  className,
  isCompact,
  ...props
}) => {
  const handleOnPerPageSelect = (_event, limit) =>
    apiRequest(apiProps, {
      offset,
      limit
    });

  const handleSetPage = (_event, number, debounce) => {
    const options = {
      offset: getNewPage(number, limit),
      limit
    };

    const request = () => apiRequest(apiProps, options);
    if (debounce) {
      return debouncePromise(request, 250)();
    }

    return request();
  };

  return (
    <div className={ className }>
      <Pagination
        perPage={ limit || 50 }
        itemCount={ count || 0 }
        onPerPageSelect={ handleOnPerPageSelect }
        page={ getCurrentPage(limit, offset) }
        onSetPage={ handleSetPage }
        direction="down"
        isCompact={ isCompact }
        { ...props }
      />
    </div>
  );
};

AsyncPagination.propTypes = {
  meta: PropTypes.shape({
    count: PropTypes.number,
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired
  }),
  apiRequest: PropTypes.func.isRequired,
  apiProps: PropTypes.any,
  className: PropTypes.string,
  isCompact: PropTypes.bool
};

AsyncPagination.defaultProps = {
  meta: {
    count: 0,
    limit: 50,
    offset: 0
  },
  className: '',
  isCompact: false
};

export default AsyncPagination;
