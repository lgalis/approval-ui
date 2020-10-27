import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import requestsMessages from '../../../messages/requests.messages';
import commonMessages from '../../../messages/common.message';
import formMessages from '../../../messages/form.messages';

const RequestInfoBar = ({ request, requestContent }) => {
  const intl = useIntl();

  return (
    <Stack hasGutter>
      <StackItem key={ 'request-detail-panel' }>
        <Card>
          <CardBody>
            <Stack hasGutter>
              <StackItem key={ 'request-summary' }>
                <Title headingLevel="h5" size="lg">
                  { intl.formatMessage(formMessages.summary) }
                </Title>
              </StackItem>
              <StackItem key={ 'request-product' }>
                <TextContent>
                  <Text className={ 'font-14' }>
                    { intl.formatMessage(commonMessages.product) }
                  </Text>
                  <Text id='portfolio-item-name' component={ TextVariants.p }>
                    { requestContent ? requestContent.product : '' }
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem key={ 'request-portfolio' }>
                <TextContent>
                  <Text className={ 'font-14' }>
                    { intl.formatMessage(commonMessages.portfolio) }
                  </Text>
                  <Text id='portfolio-name' component={ TextVariants.p }>
                    { requestContent ? requestContent.portfolio : '' }
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem key={ 'request-platform' }>
                <TextContent>
                  <Text className={ 'font-14' }>
                    { intl.formatMessage(commonMessages.platform) }
                  </Text>
                  <Text id='source-name' component={ TextVariants.p }>
                    { requestContent ? requestContent.platform : ' ' }
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem key={ 'request-requester' }>
                <TextContent>
                  <Text className={ 'font-14' }>{ intl.formatMessage(requestsMessages.requesterColumn) }</Text>
                  <Text id='requester_name' component={ TextVariants.p }>
                    { request.requester_name }
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem key={ 'request-order' }>
                <TextContent>
                  <Text className={ 'font-14' }>{ intl.formatMessage(requestsMessages.orderNumber) }</Text>
                  <Text id='order_id' component={ TextVariants.p }>
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
          <CardTitle>
            <Title headingLevel="h5" size="lg">{ intl.formatMessage(requestsMessages.parameters) }</Title>
          </CardTitle>
          <CardBody>
            <Stack hasGutter>
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
  );};

RequestInfoBar.propTypes = {
  request: PropTypes.shape({
    requester_name: PropTypes.string,
    order_id: PropTypes.string
  }).isRequired,
  requestContent: PropTypes.object
};
export default RequestInfoBar;

