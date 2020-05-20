import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { Button } from '@patternfly/react-core';
import { expandable, sortable } from '@patternfly/react-table';
import { useIntl } from 'react-intl';
import { SearchIcon } from '@patternfly/react-icons/dist/js/index';
import isEmpty from 'lodash/isEmpty';

import { fetchRequests, expandRequest, sortRequests, setFilterValueRequests, clearFilterValueRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { createRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { isApprovalAdmin, isApprovalApprover, isRequestStateActive } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import UserContext from '../../user-context';
import routesLinks from '../../constants/routes';
import { prepareChips } from './chips-helpers';

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
  (dispatch, filteringCallback, persona, updateFilter) => {
    filteringCallback(true);
    updateFilter && updateFilter();
    return dispatch(fetchRequests(persona)).then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const initialState = {
  nameValue: '',
  requesterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const requestsListState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setNameValue':
      return { ...state, nameValue: action.payload };
    case 'setRequesterValue':
      return { ...state, requesterValue: action.payload };
    case 'clearFilters':
      return { ...state, requesterValue: '', nameValue: '', isFetching: true };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    default:
      return state;
  }
};

const Requests = () => {
  const [{ nameValue, isFetching, isFiltering, requesterValue }, stateDispatch ] = useReducer(
    requestsListState,
    initialState
  );
  const { requests: { data, meta }, sortBy, filterValue } = useSelector(
    ({ requestReducer: { requests, sortBy, filterValue }}) => ({ requests, sortBy, filterValue }),
    shallowEqual
  );

  const { userPersona: userPersona } = useContext(UserContext);

  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const updateRequests = (pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchRequests(userPersona, pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  useEffect(() => {
    updateRequests();
    scrollToTop();
  }, []);

  const handleFilterChange = (value, type) => {
    const updateFilter = () => dispatch(setFilterValueRequests(value, type));

    let debouncedValue = false;

    if (type === 'name') {
      stateDispatch({ type: 'setNameValue', payload: value });
      debouncedValue = true;
    } else if (type === 'requester') {
      stateDispatch({ type: 'setRequesterValue', payload: value });
      debouncedValue = true;
    }

    if (!debouncedValue) {
      dispatch(setFilterValueRequests(value, type));
    }

    return debouncedFilter(
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      userPersona,
      debouncedValue && updateFilter
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

  const onCollapse = (id, setRows, setOpen) => {
    dispatch(expandRequest(id));
    setRows((rows) => setOpen(rows, id));
  };

  const onSort = (_e, index, direction, { property }) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(sortRequests({ index, direction, property }));
    return updateRequests();
  };

  const clearFilters = () => {
    stateDispatch({ type: 'clearFilters' });
    dispatch(clearFilterValueRequests());
    return updateRequests();
  };

  const onDeleteChip = ([{ key, chips: [{ value }] }]) => {
    const newValue = [ 'name', 'requester' ].includes(key) ? '' : filterValue[key].filter(val => value !== val);
    handleFilterChange(newValue, key);
  };

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
        fetchData={ updateRequests }
        routes={ routes }
        actionResolver={ actionResolver }
        titlePlural="requests"
        titleSingular="request"
        pagination={ meta }
        handlePagination={ updateRequests }
        filterValue={ nameValue }
        onFilterChange={ (value) => handleFilterChange(value, 'name') }
        isLoading={ isFetching || isFiltering }
        onCollapse={ onCollapse }
        renderEmptyState={ () => (
          <TableEmptyState
            title={ isEmpty(filterValue) ? 'No requests' : 'No results found' }
            Icon={ SearchIcon }
            PrimaryAction={ () =>
              isEmpty(filterValue) ? null : (
                <Button onClick={ clearFilters } variant="link">
                            Clear all filters
                </Button>
              )
            }
            description={
              isEmpty(filterValue)
                ? ''
                : 'No results match the filter criteria. Remove all filters or clear all filters to show results.'
            }
          />
        ) }
        activeFiltersConfig={ {
          filters: prepareChips({ name: nameValue, requester: requesterValue, status: filterValue.status, decision: filterValue.decision }),
          onDelete: (_e, chip, deleteAll) => deleteAll ? clearFilters() : onDeleteChip(chip)
        } }
        filterConfig={ [
          {
            label: intl.formatMessage({
              id: 'requester',
              defaultMessage: 'Requester'
            }),
            filterValues: {
              placeholder: intl.formatMessage({
                id: 'filter-by-requester',
                defaultMessage: 'Filter by requester'
              }),
              'aria-label': intl.formatMessage({
                id: 'filter-by-requester',
                defaultMessage: 'Filter by requester'
              }),
              onChange: (_event, value) => handleFilterChange(value, 'requester'),
              value: requesterValue
            }
          }, {
            label: intl.formatMessage({
              id: 'status',
              defaultMessage: 'Status'
            }),
            type: 'checkbox',
            filterValues: {
              placeholder: intl.formatMessage({
                id: 'filter-by-status',
                defaultMessage: 'Filter by status'
              }),
              'aria-label': intl.formatMessage({
                id: 'filter-by-status',
                defaultMessage: 'Filter by status'
              }),
              onChange: (_event, value) => handleFilterChange(value, 'status'),
              value: filterValue.status,
              items: [ 'canceled', 'completed', 'failed', 'notified', 'pending', 'skipped', 'started' ].map((state) => ({
                label: state,
                value: state
              }))
            }
          }, {
            label: intl.formatMessage({
              id: 'decision',
              defaultMessage: 'Decision'
            }),
            type: 'checkbox',
            filterValues: {
              placeholder: intl.formatMessage({
                id: 'filter-by-decision',
                defaultMessage: 'Filter by decision'
              }),
              'aria-label': intl.formatMessage({
                id: 'filter-by-decision',
                defaultMessage: 'Filter by decision'
              }),
              onChange: (_event, value) => handleFilterChange(value, 'decision'),
              value: filterValue.decision,
              items: [ 'approved', 'canceled', 'denied', 'error', 'undecided' ].map((state) => ({
                label: state,
                value: state
              }))
            }
          }
        ] }
      />
    </Fragment>);
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
