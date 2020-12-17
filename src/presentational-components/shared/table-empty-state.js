import React from 'react';
import PropTypes from 'prop-types';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/components/cjs/EmptyTable';
import NoRowsState from './no-rows-state';

const TableEmptyState = ({
  title,
  icon,
  isSearch,
  description,
  PrimaryAction,
  renderDescription
}) => {
  return isSearch ? <EmptyTable centered aria-label={ 'No records' }>
    <NoRowsState title={ title }
      icon={ icon }
      description={ description }
      PrimaryAction={ PrimaryAction }
      renderDescription={ renderDescription } />
  </EmptyTable> : <NoRowsState title={ title }
    icon={ icon }
    description={ description }
    PrimaryAction={ PrimaryAction }
    renderDescription={ renderDescription } />;
};

TableEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  isSearch: PropTypes.bool,
  description: PropTypes.string.isRequired,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default TableEmptyState;
