import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

const RequestInfoBar = ({ request }) => {
  return (
    <TextContent>
      <Text component={ TextVariants.small }>Product: <br/></Text>
      <Text>{ request.content ? request.content.product : 'Unknown' }</Text>
      <Text component={ TextVariants.small }>
              Portfolio:
        <br/>
      </Text>
      <Text>
        { request.content ? request.content.portfolio : '' }
      </Text>
      <Text component={ TextVariants.small }>Platform: <br/></Text>
      <Text>{ request.content ? request.content.platform : '' }</Text>
      <Text component={ TextVariants.small }>Project: <br/></Text>
      <Text>{ request.content ? request.content.project : '' }</Text>
      <Text component={ TextVariants.small }>Order Parameters: </Text>
      <Text component={ TextVariants.small }>Requester: </Text>
      <Text component={ TextVariants.h6 }>{ request.requester_name }</Text>
    </TextContent>
  );
};

RequestInfoBar.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object,
    requester_name: PropTypes.string
  }).isRequired
};
export default RequestInfoBar;

