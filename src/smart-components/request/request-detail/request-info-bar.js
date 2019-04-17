import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

const RequestInfoBar = ({ request }) => (
  <TextContent>
    <Text component={ TextVariants.h6 }>Product <br />{ request.content ? request.content.product : 'Unknown'  }</Text>
    <Text component={ TextVariants.h6 }>
      Portfolio
      <br />
      { request.content ? request.content.portfolio.display_name || request.content.portfolio.name : 'Unknown' }
    </Text>
    <Text component={ TextVariants.h6 }>Platform <br />{ request.content ? request.content.platform : 'Unknown' }</Text>
    <Text component={ TextVariants.h6 }>Project <br />{ request.content ? request.content.project : 'Unknown' }</Text>
    <Text component={ TextVariants.h6 }>Order Parameters </Text>
    <Text component={ TextVariants.h6 }>Requester: <br />{ request.content ? request.content.Requester : 'Unknown' }
    </Text>
    <Text component={ TextVariants.h6 }>
      Project: <br />
      { request.content ? request.content.parameters.project : 'Unknown' }
    </Text>
  </TextContent>
);

RequestInfoBar.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object
  }).isRequired
};
export default RequestInfoBar;

