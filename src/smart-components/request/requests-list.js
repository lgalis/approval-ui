
import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { expandable, sortable, wrappable, cellWidth } from '@patternfly/react-table';
import { useIntl } from 'react-intl';
import { SearchIcon } from '@patternfly/react-icons';
import isEmpty from 'lodash/isEmpty';

import { fetchRequests,
  expandRequest,
  sortRequests,
  setFilterValueRequests,
  clearFilterValueRequests,
  resetRequestList } from '../../redux/actions/request-actions';
import { createRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { APPROVAL_APPROVER_PERSONA, useIsApprovalAdmin, useIsApprovalApprover } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { AppTabs } from '../../smart-components/app-tabs/app-tabs';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import UserContext from '../../user-context';
import { prepareChips } from './chips-helpers';

const columns = [{
  title: 'Request ID',
  cellFormatters: [ expandable ],
  transforms: [ sortable, cellWidth(5) ]
},
{ title: 'Name', transforms: [ sortable, wrappable, cellWidth(25) ]},
{ title: 'Requester', transforms: [ sortable, wrappable, cellWidth(20) ]},
{ title: 'Opened   ', transforms: [ sortable, cellWidth(10) ]},
{ title: 'Updated  ', transforms: [ cellWidth(10) ]},
{ title: 'Status   ', transforms: [ sortable, cellWidth(15) ]},
{ title: 'Decision ', transforms: [ sortable, cellWidth(15) ]}
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

const initialState = (nameValue = '', requesterValue = '') => ({
  nameValue,
  requesterValue,
  isOpen: false,
  isFetching: true,
  isFiltering: false
});

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

const RequestsList = ({ routes, persona, actionResolver, actionsDisabled, type }) => {
  const { requests: { data, meta }, sortBy, filterValue } = useSelector(
    ({ requestReducer: { requests, sortBy, filterValue }}) => ({ requests, sortBy, filterValue }),
    shallowEqual
  );
  const [{ nameValue, isFetching, isFiltering, requesterValue }, stateDispatch ] = useReducer(
    requestsListState,
    initialState(filterValue.name, filterValue.requester)
  );

  const { userRoles: userRoles } = useContext(UserContext);

  const dispatch = useDispatch();
  const intl = useIntl();
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  const updateRequests = (pagination) => {
    if (!isApprovalApprover && persona === APPROVAL_APPROVER_PERSONA) {
      stateDispatch({ type: 'setFetching', payload: false });
      return;
    }

    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchRequests(persona, pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const resetList = () => {
    dispatch(resetRequestList());
  };

  useEffect(() => {
    resetList();
    updateRequests();
    scrollToTop();
  }, [ persona ]);

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
      persona,
      debouncedValue && updateFilter
    );
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
        { isApprovalAdmin && <AppTabs/> }
      </TopToolbar>
      <TableToolbarView
        sortBy={ sortBy }
        onSort={ onSort }
        data={ data }
        createRows={ createRows }
        type={ type }
        columns={ columns }
        fetchData={ updateRequests }
        routes={ routes }
        actionResolver={ actionResolver }
        actionsDisabled={ actionsDisabled }
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

RequestsList.propTypes = {
  routes: PropTypes.func,
  actionResolver: PropTypes.func,
  actionsDisabled: PropTypes.func,
  persona: PropTypes.string,
  type: PropTypes.string
};
RequestsList.default = {
  actionsDisabled: () => true
};

export default RequestsList;
