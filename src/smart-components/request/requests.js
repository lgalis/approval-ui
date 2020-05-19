import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { expandable, sortable } from '@patternfly/react-table';
import { fetchRequests, expandRequest, sortRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { createRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import RequestDetail from './request-detail/request-detail';
import { isApprovalAdmin, isApprovalApprover, isRequestStateActive } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import { SearchIcon } from '@patternfly/react-icons/dist/js/index';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import UserContext from '../../user-context';
import routesLinks from '../../constants/routes';
import useQuery from '../../utilities/use-query';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ],
  transforms: [ sortable ]
},
{ title: 'Requester', transforms: [ sortable ]},
{ title: 'Opened', transforms: [ sortable ]},
{ title: 'Updated' },
{ title: 'Status', transforms: [ sortable ]},
{ title: 'Decision', transforms: [ sortable ]}
];

const debouncedFilter = asyncDebounce(
  (filter, dispatch, filteringCallback, persona) => {
    filteringCallback(true);
    dispatch(fetchRequests(filter, persona)).then(() =>
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
  const { requests: { data, meta }, sortBy } = useSelector(
    ({ requestReducer: { requests, sortBy }}) => ({ requests, sortBy }),
    shallowEqual
  );

  const { userPersona: userPersona } = useContext(UserContext);

  const dispatch = useDispatch();
  const history = useHistory();
  const [{ request }] = useQuery([ 'request' ]);

  useEffect(() => {
    dispatch(
      fetchRequests(filterValue, userPersona)
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
      userPersona
    );
  };

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' },
    { eventKey: 1, title: 'Approval processes', name: '/workflows' }];

  const routes = () => <Fragment>
    <Route exact path={ routesLinks.requests.addComment } render={ props => <ActionModal { ...props }
      actionType={ 'Add Comment' }
      postMethod={ fetchRequests } /> }/>
    <Route exact path={ routesLinks.requests.approve } render={ props => <ActionModal { ...props } actionType={ 'Approve' }
      postMethod={ fetchRequests }/> } />
    <Route exact path={ routesLinks.requests.deny } render={ props => <ActionModal { ...props } actionType={ 'Deny' }
      postMethod={ fetchRequests }/> } />
  </Fragment>;

  const areActionsDisabled = (requestData) => requestData &&
    requestData.state ?
    !isRequestStateActive(requestData.state) || requestData.number_of_children > 0 || !isApprovalApprover(userPersona) : true;

  const actionResolver = (requestData) => {
    return (requestData && requestData.id && areActionsDisabled(requestData) ? null :
      [
        {
          title: 'Comment',
          onClick: () => history.push({
            pathname: routesLinks.requests.addComment,
            search: `?request=${requestData.id}`
          })
        }
      ]);
  };

  const handlePagination = (_apiProps, pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(fetchRequests(filterValue, userPersona, pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const onCollapse = (id, setRows, setOpen) => {
    dispatch(expandRequest(id));
    setRows((rows) => setOpen(rows, id));
  };

  const onSort = (_e, index, direction, { property }) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(sortRequests({ index, direction, property }));
    return dispatch(fetchRequests(filterValue, userPersona))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const renderRequestsList = () => {
    return (
      <Fragment>
        <TopToolbar>
          <TopToolbarTitle title="Approval"/>
          { isApprovalAdmin(userPersona) && <AppTabs tabItems={ tabItems } /> }
        </TopToolbar>
        <TableToolbarView
          sortBy={ sortBy }
          onSort={ onSort }
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

  return request ? <RequestDetail /> : renderRequestsList();
};

Requests.propTypes = {
  requests: PropTypes.array,
  isLoading: PropTypes.bool
};

Requests.defaultProps = {
  requests: [],
  isLoading: false
};

export default Requests;
