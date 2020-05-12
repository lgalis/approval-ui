import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardHeader,
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
        <StackItem key={ 'request-detail-panel' }>
          <Card>
            <CardBody>
              <Stack gutter="md">
                <StackItem key={ 'request-summary' }>
                  <Title headingLevel="h5" size="lg">
                    Summary
                  </Title>
                </StackItem>
                <StackItem key={ 'request-product' }>
                  <TextContent>
                    <Text className={ 'font-14' }>
                      Product
                    </Text>
                    <Text id='portfolio-item-name' component={ TextVariants.p }>
                      { requestContent ? requestContent.product : '' }
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem key={ 'request-portfolio' }>
                  <TextContent>
                    <Text className={ 'font-14' }>
                      Portfolio
                    </Text>
                    <Text id='portfolio-name' component={ TextVariants.p }>
                      { requestContent ? requestContent.portfolio : '' }
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem key={ 'request-platform' }>
                  <TextContent>
                    <Text className={ 'font-14' }>
                      Platform
                    </Text>
                    <Text id='source-name' component={ TextVariants.p }>
                      { requestContent ? requestContent.platform : ' ' }
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem key={ 'request-requester' }>
                  <TextContent>
                    <Text className={ 'font-14' }>Requester </Text>
                    <Text id='requester_name' component={ TextVariants.p }>
                      { request.requester_name }
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem key={ 'request-order' }>
                  <TextContent>
                    <Text className={ 'font-14' }>Order# </Text>
                    <Text id='requester_name' component={ TextVariants.p }>
                      { requestContent ? requestContent.order_id : '' }
                    </Text>
                  </TextContent>
                </StackItem>
              </Stack>
            </CardBody>
          </Card>
        </StackItem>
        <StackItem key={ 'request-parameters' }>
          <Card>
            <CardHeader>
              <Title headingLevel="h5" size="lg">Parameters</Title>
            </CardHeader>
            <CardBody>
              <Stack gutter="md">
                { requestContent.params && Object.keys(requestContent.params).map(param => {
                  return ((requestContent.params[param]) &&
                      <StackItem key={ `request-${requestContent.params[param]}` }>
                        <TextContent>
                          <Text key={ param } className={ 'font-14' }>
                            { `${param}` }
                          </Text>
                          <Text id={ param } component={ TextVariants.p }>
                            { `${requestContent.params[param]}` }
                          </Text>
                        </TextContent>
                      </StackItem>
                  );
                })
                }
              </Stack>
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </Fragment>
  );
};

RequestInfoBar.propTypes = {
  request: PropTypes.shape({
    requester_name: PropTypes.string,
    order_id: PropTypes.string
  }).isRequired,
  requestContent: PropTypes.object
};
export default RequestInfoBar;

