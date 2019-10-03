import React, { Fragment, useEffect, useState } from 'react';
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
  match: { params: { id }, url },
  isLoading,
  fetchRequest
}) => {
  const [ selectedRequest, setSelectedRequest ] = useState({});

  const fetchData = () => {
    fetchRequest(id).then((data) => setSelectedRequest(data.value)).catch(() => setSelectedRequest(undefined));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const breadcrumbsList = () => [
    { title: 'Request Queue', to: '/requests' },
    { title: id, isActive: true }
  ];

  const renderToolbar = () => (<TopToolbar breadcrumbs={ breadcrumbsList() } paddingBottom={ true }>
    <TopToolbarTitle title = { `Request ${id}` }>
    </TopToolbarTitle>
  </TopToolbar>);

  const renderRequestDetails = () => {
    if (isLoading || !selectedRequest || Object.keys(selectedRequest).length === 0) {
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
        <ActionModal { ...props } actionType={ 'Add Comment' } closeUrl={ url } postMethod={ fetchData }/> }/>
      <Route exact path="/requests/detail/:id/approve" render={ props =>
        <ActionModal { ...props } actionType={ 'Approve' } closeUrl={ url } postMethod={ fetchData } /> } />
      <Route exact path="/requests/detail/:id/deny" render={ props =>
        <ActionModal { ...props } actionType={ 'Deny' } closeUrl={ url } postMethod={ fetchData }/> } />
      { renderToolbar() }
      <Section type="content">
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isLoading: PropTypes.bool,
  id: PropTypes.string,
  fetchRequest: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.requestReducer.isRequestDataLoading
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchRequest
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestDetail));
