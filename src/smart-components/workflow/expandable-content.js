import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const ExpandableContent = ({ description, groups }) => (
  <Fragment>
    <TextContent>
      <Text className="data-table-detail heading" component={ TextVariants.small }>Description</Text>
      <Text className="data-table-detail content" component={ TextVariants.h5 }>{ description }</Text>
    </TextContent>
    <TextContent>
      <Text className="data-table-detail heading" component={ TextVariants.small }>Groups</Text>
      <Text
        className="data-table-detail content"
        component={ TextVariants.h5 }>
        { groups.join(',') }
      </Text>
    </TextContent>
  </Fragment>
);

ExpandableContent.propTypes = {
  description: PropTypes.string,
  groups: PropTypes.array
};

export default ExpandableContent;

