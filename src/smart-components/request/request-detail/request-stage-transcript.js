import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';
import { Title } from '@patternfly/react-core';
import StageList from './stage-list';

const RequestStageTranscript = ({ request }) => (<Fragment>
  <Title size="sm" style={ { paddingLeft: '32px' } }> Stage(s) transcript </Title>
  <StageList items={ request ? request.stages : [] } noItems={ 'No Stages' } active_stage={ request.active_stage }/>
</Fragment>);

RequestStageTranscript.propTypes = {
  request: PropTypes.shape({
    content: PropTypes.object,
    stages: PropTypes.array,
    active_stage: PropTypes.string
  }).isRequired
};

export default RequestStageTranscript;
