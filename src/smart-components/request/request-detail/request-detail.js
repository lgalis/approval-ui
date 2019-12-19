import React, { Fragment, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Route, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components';
import '../../../App.scss';
import ActionModal from '../action-modal';
import RequestInfoBar from './request-info-bar';
import RequestTranscript from './request-transcript';
import { fetchRequest, fetchRequestContent } from '../../../redux/actions/request-actions';
import { RequestLoader } from '../../../presentational-components/shared/loader-placeholders';
import { TopToolbar, TopToolbarTitle } from '../../../presentational-components/shared/top-toolbar';

const initialState = {
  isFetching: true
};
const requestState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    default:
      return state;
  }
};

const RequestDetail = () => {
  const [{ isFetching }, stateDispatch ] = useReducer(requestState, initialState);

  const { selectedRequest, requestContent } = useSelector(
    ({
      requestReducer: {
        requestContent: requestContent,
        selectedRequest: selectedRequest
      }
    }) => ({ selectedRequest, requestContent })
  );
  const match = useRouteMatch('/requests/detail/:id');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequest(match.id));
    dispatch(fetchRequestContent(match.id))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const renderRequestDetails = () => {
    if (isFetching || !selectedRequest || Object.keys(selectedRequest).length === 0) {
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
            <RequestInfoBar request={ selectedRequest } requestContent={ requestContent }/>
          </GridItem>
          <GridItem md={ 10 } className="detail-pane">
            <RequestTranscript request={ selectedRequest } url={ match.url }/>
          </GridItem>
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <Route exact path="/requests/detail/:id/add_comment" render={ props =>
        <ActionModal { ...props } actionType={ 'Add Comment' } closeUrl={ match.url } postMethod={ fetchData }/> }/>
      <Route exact path="/requests/detail/:id/approve" render={ props =>
        <ActionModal { ...props } actionType={ 'Approve' } closeUrl={ match.url } postMethod={ fetchData } /> } />
      <Route exact path="/requests/detail/:id/deny" render={ props =>
        <ActionModal { ...props } actionType={ 'Deny' } closeUrl={ match.url } postMethod={ fetchData }/> } />
      <TopToolbar
        breadcrumbs={ [{ title: 'Request Queue', to: '/requests', id: 'requests' }] }
        paddingBottom={ true }
      >
        <TopToolbarTitle title={ `Request ${match.id}` } />
      </TopToolbar>
      <Section type="content">
        <Grid gutter="md">
          { renderRequestDetails() }
        </Grid>
      </Section>
    </Fragment>
  );
};

RequestDetail.propTypes = {
  isLoading: PropTypes.bool
};

export default RequestDetail;
