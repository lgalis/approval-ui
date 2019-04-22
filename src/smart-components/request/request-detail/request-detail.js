import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Route } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';
import '../../../App.scss';

import ActionModal from '../action-modal';
import RequestInfoBar from './request-info-bar';
import RequestStageTranscript from './request-stage-transcript';
//import TopToolbar from '../../../presentational-components/shared/top-toolbar';
import { fetchRequest } from '../../../redux/actions/request-actions';
//import { ProductLoaderPlaceholder } from '../../../presentational-components/shared/loader-placeholders';

const RequestDetail = ({
  match: { url },
  //history: { push },
  isLoading,
  fetchRequest,
  requestId,
  selectedRequest
}) => {
  useEffect(() => {
    if (requestId) {
      fetchRequest(requestId);
    }
  }, [ requestId ]);

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
      <Fragment>
        <Route exact path="/requests/detail/:id/add_comment" render={ props =>
          <ActionModal { ...props } actionType={ 'Add Comment' } closeUrl={ url }/> }/>
        <Route exact path="/requests/detail/:id/approve" render={ props =>
          <ActionModal { ...props } actionType={ 'Approve' } closeUrl={ url }/> } />
        <Route exact path="/requests/detail/:id/deny" render={ props =>
          <ActionModal { ...props } actionType={ 'Deny' } closeUrl={ url } /> } />
        <Section style={ { minHeight: '100%' } }>
          <Grid gutter="md">
            <GridItem md={ 2 } className="detail-pane">
              <RequestInfoBar request={ selectedRequest }/>
            </GridItem>
            <GridItem md={ 10 } className = "detail-pane">
              <RequestStageTranscript request={ selectedRequest } url={ url }/>
            </GridItem>
          </Grid>
        </Section>
      </Fragment>
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
    requestId: id
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchRequest
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestDetail));
