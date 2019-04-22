import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import StageList from './stage-list';

const RequestStageTranscript = ({ request }) => {
  console.log('Stages:', request ? request.stages : []);
  return (<Fragment>
    <Title size="lg" > Stage(s) transcript </Title>
    <StageList items={ request ? request.stages : [] } noItems={ 'No Stages' } />
  </Fragment>);
};

RequestStageTranscript.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object
  }).isRequired
};

export default RequestStageTranscript;
