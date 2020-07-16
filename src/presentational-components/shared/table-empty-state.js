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
import { useIntl } from 'react-intl';

import tableEmptyMessages from '../../messages/table-empty.messages';

const TableEmptyState = ({
  title,
  Icon,
  description,
  PrimaryAction,
  renderDescription
}) => {
  const intl = useIntl();

  return (
    <EmptyTable centered aria-label={ intl.formatMessage(tableEmptyMessages.noRecords) }>
      <EmptyState className="pf-u-ml-auto pf-u-mr-auto">
        <EmptyStateIcon icon={ Icon } />
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
    </EmptyTable>
  );};

TableEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default TableEmptyState;
