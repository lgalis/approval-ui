import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import StageList from './stage-list';

const RequestStageTranscript = ({ request }) => {
  console.log('RequestStageTranscript: request: ', request);
  return (<Fragment>
    <Title size="sm" style={ { paddingLeft: '32px' } }> Stage(s) transcript </Title>
    <StageList items={ request ? request.stages : [] } noItems={ 'No Stages' } />
  </Fragment>);
};

RequestStageTranscript.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object
  }).isRequired
};

export default RequestStageTranscript;
