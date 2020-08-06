import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import RequestList from './request-list';
import { useIntl } from 'react-intl';
import requestsMessages from '../../../messages/requests.messages';

const RequestTranscript = ({ request, indexpath }) => {
  const intl = useIntl();

  return (<Fragment>
    <Title headingLevel="h5" size="lg" className="pf-u-pl-lg pf-u-pb-lg">{ intl.formatMessage(requestsMessages.requestTranscript) }</Title>
    <RequestList items={ request.requests && request.requests.length > 0 ? request.requests : [ request ] } indexpath={ indexpath } />
  </Fragment>);
};

RequestTranscript.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object,
    requests: PropTypes.array
  }).isRequired,
  indexpath: PropTypes.object
};

export default RequestTranscript;
