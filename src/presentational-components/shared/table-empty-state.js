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

const TableEmptyState = ({
  title,
  icon,
  description,
  PrimaryAction,
  renderDescription
}) => {
  return (
    <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
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
  );};

TableEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default TableEmptyState;
