import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { expandable } from '@patternfly/react-table';
import { fetchRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { createRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import RequestDetail from './request-detail/request-detail';
import { isRequestStateActive } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { Stack, StackItem } from '@patternfly/react-core';
import AppTabs from '../../smart-components/app-tabs/app-tabs';

const columns = [{
  title: 'RequestId',
  cellFormatters: [ expandable ]
},
'Requester',
'Opened',
'Updated',
'Stage Status',
'Decision'
];

const Requests = ({ fetchRequests, isLoading, pagination, history }) => {
  const [ filterValue, setFilterValue ] = useState('');
  const [ requests, setRequests ] = useState([]);

  const fetchData = () => {
    fetchRequests().then(({ value: { data }}) => setRequests(data));
  };

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' }, { eventKey: 1, title: 'Workflows', name: '/workflows' }];

  const routes = () => <Fragment>
    <Route exact path="/requests/add_comment/:id" render={ props => <ActionModal { ...props }
      actionType={ 'Add Comment' }
      postMethod={ fetchRequests } /> }/>
    <Route exact path="/requests/approve/:id" render={ props => <ActionModal { ...props } actionType={ 'Approve' }
      postMethod={ fetchRequests }/> } />
    <Route exact path="/requests/deny/:id" render={ props => <ActionModal { ...props } actionType={ 'Deny' }
      postMethod={ fetchRequests }/> } />
  </Fragment>;

  const areActionsDisabled = (requestData) => { return !isRequestStateActive(requestData.state);};

  const actionResolver = (requestData, { rowIndex }) => {
    return (rowIndex === 1 || areActionsDisabled(requestData) ? null :
      [
        {
          title: 'Comment',
          onClick: () =>
            history.push(`/requests/add_comment/${requestData.id}`)
        }
      ]);
  };

  const renderRequestsList = () =>
    <Stack>
      <StackItem>
        <TopToolbar>
          <TopToolbarTitle title="Approval" />
          <AppTabs tabItems={ tabItems }/>
        </TopToolbar>
      </StackItem>
      <StackItem>
        <TableToolbarView
          data={ requests }
          createRows={ createRows }
          columns={ columns }
          fetchData={ fetchData }
          request={ fetchRequests }
          routes={ routes }
          actionResolver={ actionResolver }
          areActionsDisabled={ areActionsDisabled }
          titlePlural="requests"
          titleSingular="request"
          pagination={ pagination }
          filterValue={ filterValue }
          setFilterValue={ setFilterValue }
          isLoading={ isLoading }
        />
      </StackItem>
    </Stack>;

  return (
    <Switch>
      <Route path={ '/requests/detail/:id' } render={ props => <RequestDetail { ...props }/> } />
      <Route path={ '/requests' } render={ () => renderRequestsList() } />
    </Switch>
  );
};

Requests.propTypes = {
  history: propTypes.shape({
    goBack: propTypes.func.isRequired,
    push: propTypes.func.isRequired
  }),
  filteredItems: propTypes.array,
  requests: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  filterValue: propTypes.string,
  setFilterValue: propTypes.func,
  fetchRequests: propTypes.func.isRequired,
  pagination: propTypes.shape({
    limit: propTypes.number,
    offset: propTypes.number,
    count: propTypes.number
  })
};

Requests.defaultProps = {
  requests: [],
  isLoading: false,
  pagination: {}
};

const mapStateToProps = ({ requestReducer: { requests, isRequestDataLoading }}) => ({
  requests: requests.data,
  pagination: requests.meta,
  isLoading: isRequestDataLoading
});

const mapDispatchToProps = dispatch => ({
  fetchRequests: apiProps => dispatch(fetchRequests(apiProps))
});

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
