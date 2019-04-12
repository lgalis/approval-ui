import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const SummaryContent = ({ name, description, groups }) => (
  <Fragment>
    <TextContent>
      <Text className="data-table-detail heading" component={ TextVariants.small }>Please review the workflow details</Text>
    </TextContent>
    <TextContent>
      <Text className="data-table-detail heading" component={ TextVariants.small }>Name</Text>
      <Text className="data-table-detail content" component={ TextVariants.h5 }>{ name }</Text>
    </TextContent>
    <TextContent>
      <Text className="data-table-detail heading" component={ TextVariants.small }>Description</Text>
      <Text className="data-table-detail content" component={ TextVariants.h5 }>{ description }</Text>
    </TextContent>
    <TextContent>
      <Text className="data-table-detail heading" component={ TextVariants.small }>Approval Stages</Text>
      <Text
        className="data-table-detail content"
        component={ TextVariants.h5 }>
        { groups }
      </Text>
    </TextContent>
  </Fragment>
);

SummaryContent.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  groups: PropTypes.array
};

export default SummaryContent;

