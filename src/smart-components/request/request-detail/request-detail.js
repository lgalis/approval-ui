import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Route } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';

import ActionModal from '../action-modal';
import RequestInfoBar from './request-info-bar';
import RequestStageTranscript from './request-stage-transcript';
//import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import { fetchRequest } from '../../../redux/actions/request-actions';
//import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';

const RequestDetail = ({
  match: { url, params: { id }},
  //history: { push },
  isLoading,
  fetchRequest,
  selectedRequest
}) => {
  useEffect(() => {
    if (id) {
      fetchRequest(id);
    }
  }, [ id ]);

  if (isLoading || Object.keys(selectedRequest).length === 0) {
    return (
      <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
        <div>Test</div>
      </Section>
    );
  }
  else {
    console.log('Not loading, request: ', selectedRequest);
    return (
      <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
        <Route exact path={ `${url}/add_comment` }
          render={ props => <ActionModal { ...props } closeUrl={ url } actionType={ 'Add Comment' }/> }/>
        <Route exact path={ `${url}/approve` }
          render={ props => <ActionModal { ...props } closeUrl={ url } actionType={ 'Approve' }/> }/>
        <Route exact path={ `${url}/deny` }
          render={ props => <ActionModal { ...props } closeUrl={ url } actionType={ 'Deny' }/> }/>
        <div style={ { padding: 32 } }>
          <Grid>
            <GridItem md={ 2 }>
              <RequestInfoBar request={ selectedRequest }/>
            </GridItem>
            <GridItem md={ 10 }>
              <RequestStageTranscript request={ selectedRequest } url={ url }/>
            </GridItem>
          </Grid>
        </div>
      </Section>
    );
  }
};

RequestDetail.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired
  }).isRequired,
  selectedRequest: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  fetchRequest: PropTypes.func.isRequired
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  return {
    selectedRequest: state.requestReducer.selectedRequest,
    isLoading: state.requestReducer.isRequestDataLoading,
    id
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchRequest
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestDetail));
