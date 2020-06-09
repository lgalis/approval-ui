import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import { Route, useLocation, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/components/Section';
import ActionModal from '../action-modal';
import RequestInfoBar from './request-info-bar';
import RequestTranscript from './request-transcript';
import { fetchRequest, fetchRequestContent } from '../../../redux/actions/request-actions';
import { RequestLoader } from '../../../presentational-components/shared/loader-placeholders';
import { TopToolbar, TopToolbarTitle } from '../../../presentational-components/shared/top-toolbar';
import UserContext from '../../../user-context';
import useQuery from '../../../utilities/use-query';
import routes from '../../../constants/routes';
import { approvalPersona } from '../../../helpers/shared/helpers';

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

  const [{ request: id }] = useQuery([ 'request' ]);
  const location = useLocation();
  const dispatch = useDispatch();
  const { userRoles: userRoles } = useContext(UserContext);

  useEffect(() => {
    Promise.all([ dispatch(fetchRequest(id, approvalPersona(userRoles))), dispatch(fetchRequestContent(id, approvalPersona(userRoles))) ])
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
      <Switch>
        <Route exact path={ routes.request.addComment }>
          <ActionModal actionType={ 'Add Comment' }
            closeUrl={ { pathname: routes.request.index, search: `?request=${selectedRequest.id}` } }/>
        </Route>
        <Route exact path={ routes.request.approve } render={ props =>
          <ActionModal { ...props } actionType={ 'Approve' }
            closeUrl={ { pathname: routes.request.index, search: `?request=${selectedRequest.id}` } } /> } />
        <Route exact path={ routes.request.deny } render={ props =>
          <ActionModal { ...props } actionType={ 'Deny' }
            closeUrl={ { pathname: routes.request.index, search: `?request=${selectedRequest.id}` } } /> } />
      </Switch>
      <TopToolbar
        breadcrumbs={ [
          { title: 'Request queue', to: routes.requests.index, id: 'requests' },
          { title: `Request ${id}`, id }
        ] }
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
