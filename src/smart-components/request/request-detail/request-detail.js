import React, { Fragment, useContext, useEffect, useReducer } from 'react';
import { Route, useLocation, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, GridItem } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';
import ActionModal from '../action-modal';
import RequestInfoBar from './request-info-bar';
import RequestTranscript from './request-transcript';
import { fetchRequest, fetchRequestContent } from '../../../redux/actions/request-actions';
import { RequestLoader } from '../../../presentational-components/shared/loader-placeholders';
import { TopToolbar, TopToolbarTitle } from '../../../presentational-components/shared/top-toolbar';
import UserContext from '../../../user-context';
import useQuery from '../../../utilities/use-query';
import { approvalPersona } from '../../../helpers/shared/helpers';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import requestsMessages from '../../../messages/requests.messages';

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

const RequestDetail = ({ requestBreadcrumbs, indexpath }) => {
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
  const intl = useIntl();

  useEffect(() => {
    Promise.all([ dispatch(fetchRequest(id, approvalPersona(userRoles))), dispatch(fetchRequestContent(id, approvalPersona(userRoles))) ])
    .then(() => stateDispatch({ type: 'setFetching', payload: false }));
  }, []);

  const updateRequest = (id) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchRequest(id, approvalPersona(userRoles))), dispatch(fetchRequestContent(id, approvalPersona(userRoles)))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

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
          <GridItem md={ 4 } lg={ 3 } className="info-bar pf-u-p-0">
            <RequestInfoBar request={ selectedRequest } requestContent={ requestContent }/>
          </GridItem>
          <GridItem md={ 8 } lg={ 9 } className="detail-pane pf-u-p-lg">
            <RequestTranscript request={ selectedRequest } url={ location.url } indexpath={ indexpath }/>
          </GridItem>
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <Switch>
        <Route exact path={ indexpath.comment }>
          <ActionModal actionType={ 'Comment' }
            postMethod={ () => updateRequest(selectedRequest.id) }
            closeUrl={ { pathname: indexpath.index, search: `?request=${selectedRequest.id}` } }/>
        </Route>
        <Route exact path={ indexpath.approve } render={ props =>
          <ActionModal { ...props } actionType={ 'Approve' }
            postMethod={ () => updateRequest(selectedRequest.id) }
            closeUrl={ { pathname: indexpath.index, search: `?request=${selectedRequest.id}` } } /> } />
        <Route exact path={ indexpath.deny } render={ props =>
          <ActionModal { ...props } actionType={ 'Deny' }
            postMethod={ () => updateRequest(selectedRequest.id) }
            closeUrl={ { pathname: indexpath.index, search: `?request=${selectedRequest.id}` } } /> } />
      </Switch>
      <TopToolbar
        breadcrumbs={ requestBreadcrumbs }
        paddingBottom={ true }
      >
        <TopToolbarTitle title={ intl.formatMessage(requestsMessages.requestTitle, { id }) } />
      </TopToolbar>
      <Section type="content">
        <Grid hasGutter>
          { renderRequestDetails() }
        </Grid>
      </Section>
    </Fragment>
  );
};

RequestDetail.propTypes = {
  requestBreadcrumbs: PropTypes.array,
  indexpath: PropTypes.object
};

export default RequestDetail;
