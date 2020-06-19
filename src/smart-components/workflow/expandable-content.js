import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const ExpandableContent = ({ description, groupRefs }) => {
  const listGroupNames = (groupRefs) => groupRefs.map((ref) => ref.name);

  return (
    <Fragment>
      <TextContent>
        <Text className="pf-u-mb-0" component={ TextVariants.small }>Description</Text>
        <Text className="pf-u-mb-md" component={ TextVariants.p }>{ description }</Text>
      </TextContent>
      <TextContent>
        <Fragment>
          <Text className="pf-u-mb-0" component={ TextVariants.small }>Groups</Text>
          <Text className="pf-u-mb-md"
            component={ TextVariants.p }>
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
