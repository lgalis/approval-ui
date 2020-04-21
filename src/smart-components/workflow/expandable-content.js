import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const ExpandableContent = ({ description, groupRefs }) => {
  const listGroupNames = (groupRefs) => groupRefs.map((ref) => ref.name);

  return (
    <Fragment>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.small }>Description</Text>
        <Text className="data-table-detail content" component={ TextVariants.h5 }>{ description }</Text>
      </TextContent>
      <TextContent>
        <Fragment>
          <Text className="data-table-detail heading" component={ TextVariants.small }>Groups</Text>
          <Text className="data-table-detail content"
            component={ TextVariants.h5 }>
            { listGroupNames(groupRefs).join(',') }
          </Text>
        </Fragment>
      </TextContent>
    </Fragment>
  );
};

ExpandableContent.propTypes = {
  description: PropTypes.string,
  groupRefs: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired
};

export default ExpandableContent;
