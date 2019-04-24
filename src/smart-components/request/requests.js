import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { expandable } from '@patternfly/react-table';
import { fetchRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { createInitialRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { Section } from '@red-hat-insights/insights-frontend-components';
import RequestDetail from './request-detail/request-detail';

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
    <Route exact path="/requests/add_comment/:id" render={ props => <ActionModal { ...props } actionType={ 'Add Comment' } /> }/>
    <Route exact path="/requests/approve/:id" render={ props => <ActionModal { ...props } actionType={ 'Approve' } /> } />
    <Route exact path="/requests/deny/:id" render={ props => <ActionModal { ...props } actionType={ 'Deny' } /> } />
  </Fragment>;

  const actionResolver = (requestData, { rowIndex }) => rowIndex === 1 ? null :
    [
      {
        title: 'Comment',
        onClick: () =>
          history.push(`/requests/add_comment/${requestData.id}`)
      }
    ];

  const renderRequestsList = () =>
    <TableToolbarView
      data={ requests }
      createInitialRows={ createInitialRows }
      columns={ columns }
      fetchData={ fetchData }
      request={ fetchRequests }
      routes={ routes }
      actionResolver={ actionResolver }
      titlePlural="Requests"
      titleSingular="Request"
      pagination={ pagination }
    />;

  return (
    <Section>
      <Switch>
        <Route path={ '/requests/detail/:id' } render={ props => <RequestDetail { ...props }/> } />
        <Route path={ '/requests' } render={ () => renderRequestsList() } />
      </Switch>
    </Section>
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
