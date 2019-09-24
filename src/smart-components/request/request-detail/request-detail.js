import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Route } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';
import '../../../App.scss';
import ActionModal from '../action-modal';
import RequestInfoBar from './request-info-bar';
import RequestStageTranscript from './request-stage-transcript';
import { fetchRequest } from '../../../redux/actions/request-actions';
import { RequestLoader } from '../../../presentational-components/shared/loader-placeholders';
import { TopToolbar, TopToolbarTitle } from '../../../presentational-components/shared/top-toolbar';

const RequestDetail = ({
  match: { url },
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

  const breadcrumbsList = () => [
    { title: 'Request Queue', to: '/requests' },
    { title: requestId, isActive: true }
  ];

  const renderToolbar = () => (<TopToolbar breadcrumbs={ breadcrumbsList() } paddingBottom={ true }>
    <TopToolbarTitle title = { `Request ${requestId}` }>
    </TopToolbarTitle>
  </TopToolbar>);

  const renderRequestDetails = () => {
    if (isLoading || Object.keys(selectedRequest).length === 0) {
      return (
        <Section style={ { backgroundColor: 'white', minHeight: '100%' } }>
          <RequestLoader />
        </Section>
      );
    }
    else {
      return (
        <Fragment>
          <GridItem md={ 2 } className="detail-pane">
            <RequestInfoBar request={ selectedRequest }/>
          </GridItem>
          <GridItem md={ 10 } className = "detail-pane">
            <RequestStageTranscript request={ selectedRequest } url={ url }/>
          </GridItem>
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <Route exact path="/requests/detail/:id/add_comment" render={ props =>
        <ActionModal { ...props } actionType={ 'Add Comment' } closeUrl={ url }/> }/>
      <Route exact path="/requests/detail/:id/approve" render={ props =>
        <ActionModal { ...props } actionType={ 'Approve' } closeUrl={ url }/> } />
      <Route exact path="/requests/detail/:id/deny" render={ props =>
        <ActionModal { ...props } actionType={ 'Deny' } closeUrl={ url } /> } />
      { renderToolbar() }
      <Section className="data-table-pane">
        <Grid gutter="md">
          { renderRequestDetails() }
        </Grid>
      </Section>
    </Fragment>
  );
};

RequestDetail.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired
  }).isRequired,
  selectedRequest: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  requestId: PropTypes.string,
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
