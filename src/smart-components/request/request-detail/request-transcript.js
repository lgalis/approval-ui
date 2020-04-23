import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import RequestList from './request-list';

const RequestTranscript = ({ request }) => (<Fragment>
  <Title size="sm" style={ { paddingLeft: '32px' } }> Request transcript </Title>
  <RequestList items={ request.requests && request.requests.length > 0 ? request.requests : request }/>
</Fragment>);

RequestTranscript.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object,
    requests: PropTypes.array
  }).isRequired
};

export default RequestTranscript;
