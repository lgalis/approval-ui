import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';

const RequestInfoBar = ({ request, requestContent }) => {
  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Card>
            <Stack gutter="md">
              <StackItem>
                <Title>
                  Summary
                </Title>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text className={ 'font-14' }>
                    Product
                  </Text>
                  <Text id='portfolio-item-name' component={ TextVariants.p }>
                    { requestContent ? requestContent.product : '' }
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text className={ 'font-14' }>
                    Portfolio
                  </Text>
                  <Text  id='portfolio-name' component={ TextVariants.p }>
                    { requestContent ? requestContent.portfolio : '' }
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text className={ 'font-14' }>
                    Platform
                  </Text>
                  <Text id='source-name' component={ TextVariants.p }>
                    { requestContent ? requestContent.platform : ' ' }
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text className={ 'font-14' }>Requester: </Text>
                  <Text id='requester_name' component={ TextVariants.p }>
                    { request.requester_name }
                  </Text>
                </TextContent>
              </StackItem>
            </Stack>
          </Card>
        </StackItem>
        <StackItem>
          <Card>
            <TextContent>
              <Text component={ TextVariants.h6 }>Order Parameters: <br/> </Text>
              { requestContent.params && Object.keys(requestContent.params).map(param => {
                return ((requestContent.params[param]) &&
                    <Text key={ param } component={ TextVariants.small }>
                      { `${param}: ${requestContent.params[param]}` }
                    </Text>);
              })
              }
            </TextContent>
          </Card>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

RequestInfoBar.propTypes = {
  request: PropTypes.shape({
    requester_name: PropTypes.string
  }).isRequired,
  requestContent: PropTypes.object
};
export default RequestInfoBar;

