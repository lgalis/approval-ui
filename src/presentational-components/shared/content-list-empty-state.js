import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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

const ContentListEmptyState = ({
  title,
  Icon,
  description,
  PrimaryAction,
  renderDescription
}) => (
  <div className="pf-u-mt-xl">
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
  </div>
);

ContentListEmptyState.defaultProps = {
  renderDescription: () => null
};

ContentListEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.any.isRequired,
  description: PropTypes.string.isRequired,
  PrimaryAction: PropTypes.any,
  renderDescription: PropTypes.func
};

export default ContentListEmptyState;

export const EmptyStatePrimaryAction = ({ url, label }) => (
  <Link to={ url }>
    <Button variant="primary">{ label }</Button>
  </Link>
);

EmptyStatePrimaryAction.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};
