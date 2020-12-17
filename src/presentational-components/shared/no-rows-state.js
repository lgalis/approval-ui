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

const NoRowsState = ({ title,
  icon,
  description,
  PrimaryAction,
  renderDescription }) =>
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

NoRowsState.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  isSearch: PropTypes.bool,
  description: PropTypes.string.isRequired,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default NoRowsState;
