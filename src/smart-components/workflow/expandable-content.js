import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const ExpandableContent = ({ description, groupRefs, groupNames }) => (
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
        { groupRefs.reduce((acc, curr, idx) => acc.concat(`${(idx > 0) ? ',' : ''} ${groupNames[idx] || curr}`), '') }
      </Text>
    </TextContent>
  </Fragment>
);

ExpandableContent.propTypes = {
  description: PropTypes.string,
  groupRefs: PropTypes.array.required,
  groupNames: PropTypes.array.required
};

export default ExpandableContent;

