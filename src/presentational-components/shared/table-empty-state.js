import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { EmptyTable } from '@redhat-cloud-services/frontend-components';
import { Link }  from 'react-router-dom';

const TableEmptyState = ({
  title,
  Icon,
  description,
  PrimaryAction,
  renderDescription
}) => (
  <EmptyTable centered
    aria-label="No records"
  >
    <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
      <EmptyStateIcon icon={ Icon } />
      <TextContent>
        <Text component={ TextVariants.h1 }>{ title }</Text>
      </TextContent>
      <EmptyStateBody>
        { description }
        { renderDescription() }
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        { PrimaryAction && <PrimaryAction /> }
      </EmptyStateSecondaryActions>
    </EmptyState>
  </EmptyTable>
);

TableEmptyState.defaultProps = {
  renderDescription: () => null
};

TableEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default TableEmptyState;

export const EmptyStatePrimaryAction = ({ url, label }) => (
  <Link to={ url }>
    <Button variant="secondary">{ label }</Button>
  </Link>
);

EmptyStatePrimaryAction.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};
