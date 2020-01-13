import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, TextVariants } from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from '@patternfly/react-table';

import { DataListLoader } from '../../presentational-components/shared/loader-placeholders';

const NoItems = () => <Text component={ TextVariants.h1 }>No items found</Text>;

const ContentList = ({
  data,
  columns,
  isCompact,
  isLoading,
  actionResolver,
  areActionsDisabled,
  borders,
  routes,
  titlePlural,
  renderEmptyState
}) => {
  const [ rows, setRows ] = useState([]);

  useEffect(() => {
    setRows(data);
  }, [ data ]);

  const renderEmptyContent = () =>
    renderEmptyState ? renderEmptyState() : <NoItems />;

  const renderContent = () =>
    rows.length === 0 ? (
      renderEmptyContent()
    ) : (
      <Fragment>
        { routes() }
        <Table
          aria-label={ `${titlePlural} table` }
          variant={ isCompact ? TableVariant.compact : null }
          borders={ borders }
          rows={ rows }
          cells={ columns }
          actionResolver={ actionResolver }
          areActionsDisabled={ areActionsDisabled }
        >
          <TableHeader />
          <TableBody />
        </Table>
      </Fragment>
    );

  return isLoading ? <DataListLoader /> : renderContent();
};

ContentList.propTypes = {
  borders: PropTypes.bool,
  isCompact: PropTypes.bool,
  columns: PropTypes.array.isRequired,
  renderEmptyState: PropTypes.func.isRequired,
  data: PropTypes.array,
  pagination: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
    count: PropTypes.number
  }),
  titlePlural: PropTypes.string,
  titleSingular: PropTypes.string,
  routes: PropTypes.func,
  actionResolver: PropTypes.func,
  areActionsDisabled: PropTypes.func,
  isLoading: PropTypes.bool
};

ContentList.defaultProps = {
  requests: [],
  isLoading: false,
  isCompact: false,
  borders: true,
  routes: () => null,
  items: PropTypes.array,
  renderEmptyState: PropTypes.func
};

export default ContentList;
