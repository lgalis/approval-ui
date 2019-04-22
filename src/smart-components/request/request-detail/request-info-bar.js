import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

const RequestInfoBar = ({ request }) => {
  return (
    <TextContent>
      <Text component={ TextVariants.h6 }>Product: <br/>{ request.content ? request.content.product : 'Unknown' }</Text>
      <Text component={ TextVariants.h6 }>
          Portfolio:
        <br/>
        { request.content ? request.content.portfolio : '' }
      </Text>
      <Text component={ TextVariants.h6 }>Platform: <br/>{ request.content ? request.content.platform : '' }</Text>
      <Text component={ TextVariants.h6 }>Project: <br/>{ request.content ? request.content.project : '' }</Text>
      <Text component={ TextVariants.h6 }>Order Parameters: </Text>
      <Text component={ TextVariants.h6 }>Requester: <br/>{ request.requester }
      </Text>
      <Text component={ TextVariants.h6 }>Project: <br/> </Text>
      { request.content.params && Object.keys(request.content.params).map(param => {
        return ((request.content.params[param] && request.content.params[param] !== '********') &&
              <Text key={ param } component={ TextVariants.small }>
                { `${param}: ${request.content.params[param]}` }
              </Text>);
      })
      }
    </TextContent>
  );
};

RequestInfoBar.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object
  }).isRequired
};
export default RequestInfoBar;

