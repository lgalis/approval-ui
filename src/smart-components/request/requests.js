import React, { Fragment, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { expandable } from '@patternfly/react-table';
import { fetchRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { createRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import RequestDetail from './request-detail/request-detail';
import { isRequestStateActive } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
'Requester',
'Opened',
'Updated',
'Status',
'Decision'
];

const debouncedFilter = asyncDebounce(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(fetchRequests(filter, meta)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);
const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const requestsListState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    default:
      return state;
  }
};

const Requests = () => {
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(
    requestsListState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ requestReducer: { requests }}) => requests
  );

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(
      fetchRequests(filterValue, defaultSettings)
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      {
        ...meta,
        offset: 0
      }
    );
  };

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' },
    { eventKey: 1, title: 'Workflows', name: '/workflows' }];

  const routes = () => <Fragment>
    <Route exact path="/requests/add_comment/:id" render={ props => <ActionModal { ...props }
      actionType={ 'Add Comment' }
      postMethod={ fetchRequests } /> }/>
    <Route exact path="/requests/approve/:id" render={ props => <ActionModal { ...props } actionType={ 'Approve' }
      postMethod={ fetchRequests }/> } />
    <Route exact path="/requests/deny/:id" render={ props => <ActionModal { ...props } actionType={ 'Deny' }
      postMethod={ fetchRequests }/> } />
  </Fragment>;

  const areActionsDisabled = (requestData) => requestData &&
    requestData.state ? !isRequestStateActive(requestData.state.title) && !requestData.number_of_children : true;

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

  const handlePagination = (_apiProps, pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(fetchRequests(filterValue, pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const renderRequestsList = () => {
    return (
      <Fragment>
        <TopToolbar>
          <TopToolbarTitle title="Approval"/>
          <AppTabs tabItems={ tabItems }/>
        </TopToolbar>
        <TableToolbarView
          data={ data }
          createRows={ createRows }
          columns={ columns }
          fetchData={ handlePagination }
          routes={ routes }
          actionResolver={ actionResolver }
          areActionsDisabled={ areActionsDisabled }
          titlePlural="requests"
          titleSingular="request"
          pagination={ meta }
          handlePagination={ handlePagination }
          filterValue={ filterValue }
          onFilterChange={ handleFilterChange }
          isLoading={ isFetching || isFiltering }
        />
      </Fragment>);
  };

  return (
    <Switch>
      <Route path={ '/requests/detail/:id' } render={ props => <RequestDetail { ...props }/> } />
      <Route path={ '/requests' } render={ () => renderRequestsList() } />
    </Switch>
  );
};

Requests.PropTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  requests: PropTypes.array,
  isLoading: PropTypes.bool
};

Requests.defaultProps = {
  requests: [],
  isLoading: false
};

export default Requests;
