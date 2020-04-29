import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import { Route, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';
import '../../../App.scss';
import ActionModal from '../action-modal';
import RequestInfoBar from './request-info-bar';
import RequestTranscript from './request-transcript';
import { fetchRequest, fetchRequestContent } from '../../../redux/actions/request-actions';
import { RequestLoader } from '../../../presentational-components/shared/loader-placeholders';
import { TopToolbar, TopToolbarTitle } from '../../../presentational-components/shared/top-toolbar';
import UserContext from '../../../user-context';
import { approvalPersona } from '../../../helpers/shared/helpers';
import { REQUEST_DETAIL_ROUTE } from '../../../utilities/constants';

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
  const { id }  = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { roles: userRoles } = useContext(UserContext);

  useEffect(() => {
    const persona = approvalPersona(userRoles);
    Promise.all([ dispatch(fetchRequest(id, persona)), dispatch(fetchRequestContent(id, persona)) ])
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
          <GridItem md={ 4 } lg={ 3 } className="info-bar">
            <RequestInfoBar request={ selectedRequest } requestContent={ requestContent }/>
          </GridItem>
          <GridItem md={ 8 } lg={ 9 } className="detail-pane">
            <RequestTranscript request={ selectedRequest } url={ location.url }/>
          </GridItem>
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <Route exact path="/requests/detail/:id/add_comment" render={ props =>
        <ActionModal { ...props } actionType={ 'Add Comment' } closeUrl={ `${REQUEST_DETAIL_ROUTE}${id}` }/> }/>
      <Route exact path="/requests/detail/:id/approve" render={ props =>
        <ActionModal { ...props } actionType={ 'Approve' } closeUrl={ `${REQUEST_DETAIL_ROUTE}${id}` } /> } />
      <Route exact path="/requests/detail/:id/deny" render={ props =>
        <ActionModal { ...props } actionType={ 'Deny' } closeUrl={ `${REQUEST_DETAIL_ROUTE}${id}` }  /> } />
      <TopToolbar
        breadcrumbs={ [{ title: 'Request queue', to: '/requests', id: 'requests' }] }
        paddingBottom={ true }
      >
        <TopToolbarTitle title={ `Request ${id}` } />
      </TopToolbar>
      <Section type="content">
        <Grid gutter="md">
          { renderRequestDetails() }
        </Grid>
      </Section>
    </Fragment>
  );
};

export default RequestDetail;
