import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { expandable } from '@patternfly/react-table';
import { fetchRequests, fetchRequest } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { createInitialRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { Section } from '@red-hat-insights/insights-frontend-components';
import RequestDetail from './request-detail/request-detail';
import { isRequestStateActive } from '../../helpers/shared/helpers';
import TopToolbar, { TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { PageHeader } from '@red-hat-insights/insights-frontend-components';
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

const Requests = ({ fetchRequests, requests, pagination, history }) => {
  const fetchData = (setRows) => {
    fetchRequests().then(({ value: { data }}) => setRows(createInitialRows(data)));
  };

  const routes = () => <Fragment>
    <Route exact path="/requests/add_comment/:id" render={ props => <ActionModal { ...props }
      actionType={ 'Add Comment' }
      preMethod = { fetchRequest }
      postMethod={ fetchRequests } /> }/>
    <Route exact path="/requests/approve/:id" render={ props => <ActionModal { ...props } actionType={ 'Approve' }
      preMethod = { fetchRequest }
      postMethod={ fetchRequests }/> } />
    <Route exact path="/requests/deny/:id" render={ props => <ActionModal { ...props } actionType={ 'Deny' }
      preMethod = { fetchRequest }
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
    <Fragment>
      <PageHeader style={ { paddingBottom: 0, marginBottom: 0 } }>
        <TopToolbar>
          <TopToolbarTitle title = { 'Approval' }>
          </TopToolbarTitle>
        </TopToolbar>
        <AppTabs />
      </PageHeader>
      <Section style={ { marginTop: 20, minHeight: '100%' } } >
        <TableToolbarView
          data={ requests }
          createInitialRows={ createInitialRows }
          columns={ columns }
          fetchData={ fetchData }
          request={ fetchRequests }
          routes={ routes }
          actionResolver={ actionResolver }
          areActionsDisabled={ areActionsDisabled }
          titlePlural="Requests"
          titleSingular="Request"
          pagination={ pagination }
        />
      </Section>
    </Fragment>;

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
  }).isRequired,
  filteredItems: propTypes.array,
  requests: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  fetchRequests: propTypes.func.isRequired,
  pagination: propTypes.shape({
    limit: propTypes.number.isRequired,
    offset: propTypes.number.isRequired,
    count: propTypes.number.isRequired
  })
};

Requests.defaultProps = {
  requests: [],
  pagination: {}
};

const mapStateToProps = ({ requestReducer: { requests, isRequestDataLoading, filterValue }}) => ({
  requests: requests.data,
  pagination: requests.meta,
  isLoading: isRequestDataLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => ({
  fetchRequests: apiProps => dispatch(fetchRequests(apiProps))
});

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
