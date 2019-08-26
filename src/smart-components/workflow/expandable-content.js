import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const ExpandableContent = ({ description, group_refs, group_names }) => (
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
        { group_refs.reduce((acc, curr, idx) => acc.concat(`${(idx > 0) ? ',' : ''} ${group_names[idx] || curr}`), '') }
      </Text>
    </TextContent>
  </Fragment>
);

ExpandableContent.propTypes = {
  description: PropTypes.string,
  group_refs: PropTypes.array.required,
  group_names: PropTypes.array.required
};

export default ExpandableContent;

