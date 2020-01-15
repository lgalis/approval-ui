import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

const RequestInfoBar = ({ request, requestContent }) => {
  console.log('DEBUG info bar: request, requestContent: ', request, requestContent);
  return (
    <TextContent>
      <Text component={ TextVariants.small }>Product: <br/></Text>
      <Text>{ requestContent ? requestContent.product : '' }</Text>
      <Text component={ TextVariants.small }>Portfolio: <br/></Text>
      <Text>{ requestContent ? requestContent.portfolio : '' }</Text>
      <Text component={ TextVariants.small }>Platform: <br/></Text>
      <Text>{ requestContent ? requestContent.platform : ' ' }</Text>
      <Text component={ TextVariants.small }>Requester: </Text>
      <Text component={ TextVariants.h6 }>{ request.requester_name }</Text>
      <Text component={ TextVariants.h6 }>Order Parameters: <br/> </Text>
      { requestContent.params && Object.keys(requestContent.params).map(param => {
        return ((requestContent.params[param]) &&
                  <Text key={ param } component={ TextVariants.small }>
                    { `${param}: ${requestContent.params[param]}` }
                  </Text>);
      })
      }
    </TextContent>
  );
};

RequestInfoBar.propTypes = {
  request: PropTypes.shape({
    requester_name: PropTypes.string
  }).isRequired,
  requestContent: PropTypes.object
};
export default RequestInfoBar;

