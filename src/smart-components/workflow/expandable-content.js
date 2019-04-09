import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';

const ExpandableContent = ({ description, groups }) => (
  <Fragment>
    <TextContent>
      <Text className="groups-table-detail heading" component={ TextVariants.small }>Description</Text>
      <Text className="groups-table-detail content" component={ TextVariants.h5 }>{ description }</Text>
    </TextContent>
    <TextContent>
      <Text className="groups-table-detail heading" component={ TextVariants.small }>groups</Text>
      <Text
        className="groups-table-detail content"
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

