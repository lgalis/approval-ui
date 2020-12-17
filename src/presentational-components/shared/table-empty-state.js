import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/components/cjs/EmptyTable';

const noRows = (title,
  icon,
  description,
  PrimaryAction,
  renderDescription) =>
  (<EmptyState className="pf-u-ml-auto pf-u-mr-auto">
    <EmptyStateIcon icon={ icon } />
    <TextContent>
      <Text component={ TextVariants.h1 }>{ title }</Text>
    </TextContent>
    <EmptyStateBody>
      { description }
      { renderDescription && renderDescription() }
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      { PrimaryAction && <PrimaryAction /> }
    </EmptyStateSecondaryActions>
  </EmptyState>
  );

const TableEmptyState = ({
  title,
  icon,
  isSearch,
  description,
  PrimaryAction,
  renderDescription
}) => {
  return isSearch ? <EmptyTable centered aria-label={ 'No records' }>{ noRows(title,
    icon,
    description,
    PrimaryAction,
    renderDescription
  ) }</EmptyTable> : noRows(
    title,
    icon,
    description,
    PrimaryAction,
    renderDescription
  );
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
