import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import RequestList from './request-list';

const RequestTranscript = ({ request }) => (<Fragment>
  <Title size="sm" style={ { paddingLeft: '32px' } }> Request transcript </Title>
  <RequestList items={ request.children && request.children.length > 0 ? request.children : [ request ] }/>
</Fragment>);

RequestTranscript.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object,
    children: PropTypes.array
  }).isRequired
};

export default RequestTranscript;
