import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { expandable } from '@patternfly/react-table';
import { fetchRequests, expandRequest } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { createRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import RequestDetail from './request-detail/request-detail';
import { isApprovalAdmin, isRequestStateActive } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import { SearchIcon } from '@patternfly/react-icons/dist/js/index';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import UserContext from '../../user-context';

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
  (filter, dispatch, filteringCallback, persona, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(fetchRequests(filter, persona, meta)).then(() =>
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

  const { userPersona: userPersona } = useContext(UserContext);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(
      fetchRequests(filterValue, defaultSettings, userPersona)
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
      },
      userPersona
    );
  };

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' },
    { eventKey: 1, title: 'Approval processes', name: '/workflows' }];

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
    requestData.state ?
    !isRequestStateActive(requestData.state) || requestData.number_of_children > 0 : true;

  const actionResolver = (requestData) => {
    return (requestData && requestData.id && areActionsDisabled(requestData) ? null :
      [
        {
          title: 'Comment',
          onClick: () => history.push(`/requests/add_comment/${requestData.id}`)
        }
      ]);
  };

  const handlePagination = (_apiProps, pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(fetchRequests(filterValue, pagination, userPersona))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const onCollapse = (id, setRows, setOpen) => {
    dispatch(expandRequest(id));
    setRows((rows) => setOpen(rows, id));
  };

  const renderRequestsList = () => {
    return (
      <Fragment>
        <TopToolbar>
          <TopToolbarTitle title="Approval"/>
          { isApprovalAdmin(userPersona) && <AppTabs tabItems={ tabItems } /> }
        </TopToolbar>
        <TableToolbarView
          data={ data }
          createRows={ createRows }
          columns={ columns }
          fetchData={ handlePagination }
          routes={ routes }
          actionResolver={ actionResolver }
          titlePlural="requests"
          titleSingular="request"
          pagination={ meta }
          handlePagination={ handlePagination }
          filterValue={ filterValue }
          onFilterChange={ handleFilterChange }
          isLoading={ isFetching || isFiltering }
          onCollapse={ onCollapse }
          renderEmptyState={ () => (
            <TableEmptyState
              title={ filterValue === '' ? 'No requests' : 'No results found' }
              Icon={ SearchIcon }
              PrimaryAction={ () =>
                filterValue !== '' ? (
                  <Button onClick={ () => handleFilterChange('') } variant="link">
                            Clear all filters
                  </Button>
                ) : null
              }
              description={
                filterValue === ''
                  ? ''
                  : 'No results match the filter criteria. Remove all filters or clear all filters to show results.'
              }
            />
          ) }
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

Requests.propTypes = {
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
