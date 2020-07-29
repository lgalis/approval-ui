
import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { sortable, wrappable, cellWidth } from '@patternfly/react-table';
import { useIntl } from 'react-intl';
import { SearchIcon } from '@patternfly/react-icons';
import isEmpty from 'lodash/isEmpty';

import { fetchRequests,
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
import routes from '../../constants/routes';
import tableToolbarMessages from '../../messages/table-toolbar.messages';
import requestsMessages from '../../messages/requests.messages';
import commonMessages from '../../messages/common.message';

const columns = (intl) => [{
  title: intl.formatMessage(requestsMessages.requestsIdColumn),
  transforms: [ sortable, cellWidth(5) ]
},
{ title: intl.formatMessage(tableToolbarMessages.name), transforms: [ sortable, wrappable, cellWidth(25) ]},
{ title: intl.formatMessage(requestsMessages.requesterColumn), transforms: [ sortable, wrappable, cellWidth(20) ]},
{ title: intl.formatMessage(requestsMessages.updatedColumn), transforms: [ cellWidth(10) ]},
{ title: intl.formatMessage(requestsMessages.statusColumn), transforms: [ sortable, cellWidth(15) ]}
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

const RequestsList = ({ routes, persona, indexpath, actionResolver }) => {
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
        <TopToolbarTitle title={ intl.formatMessage(commonMessages.approvalTitle) }/>
        { isApprovalAdmin && <AppTabs/> }
      </TopToolbar>
      <TableToolbarView
        sortBy={ sortBy }
        onSort={ onSort }
        data={ data }
        createRows={ createRows(actionResolver) }
        indexpath={ indexpath }
        columns={ columns(intl) }
        fetchData={ updateRequests }
        routes={ routes }
        titlePlural={ intl.formatMessage(requestsMessages.requests) }
        titleSingular={ intl.formatMessage(requestsMessages.request) }
        pagination={ meta }
        handlePagination={ updateRequests }
        filterValue={ nameValue }
        onFilterChange={ (value) => handleFilterChange(value, 'name') }
        isLoading={ isFetching || isFiltering }
        renderEmptyState={ () => (
          <TableEmptyState
            title={ isEmpty(filterValue)
              ? intl.formatMessage(tableToolbarMessages.noResultsFound, { results: intl.formatMessage(requestsMessages.requests) })
              : intl.formatMessage(tableToolbarMessages.noResultsFound)
            }
            Icon={ SearchIcon }
            PrimaryAction={ () =>
              isEmpty(filterValue) ? null : (
                <Button onClick={ clearFilters } variant="link">
                  { intl.formatMessage(tableToolbarMessages.clearAllFilters) }
                </Button>
              )
            }
            description={
              isEmpty(filterValue)
                ? ''
                : intl.formatMessage(tableToolbarMessages.clearAllFiltersDescription)
            }
          />
        ) }
        activeFiltersConfig={ {
          filters: prepareChips({ name: nameValue, requester: requesterValue, decision: filterValue.decision }, intl),
          onDelete: (_e, chip, deleteAll) => deleteAll ? clearFilters() : onDeleteChip(chip)
        } }
        filterConfig={ [
          {
            label: intl.formatMessage(requestsMessages.requesterColumn),
            filterValues: {
              placeholder: intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.requesterColumn).toLowerCase() }
              ),
              'aria-label': intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.requesterColumn).toLowerCase() }
              ),
              onChange: (_event, value) => handleFilterChange(value, 'requester'),
              value: requesterValue
            }
          }, {
            label: intl.formatMessage(requestsMessages.statusColumn),
            type: 'checkbox',
            filterValues: {
              placeholder: intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.statusColumn).toLowerCase() }
              ),
              'aria-label': intl.formatMessage(
                tableToolbarMessages.filterByTitle,
                { title: intl.formatMessage(requestsMessages.statusColumn).toLowerCase() }
              ),
              onChange: (_event, value) => handleFilterChange(value, 'decision'),
              value: filterValue.decision,
              items: [ 'approved', 'canceled', 'denied', 'error', 'undecided' ].map((state) => ({
                label: intl.formatMessage(requestsMessages[state]),
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
  persona: PropTypes.string,
  indexpath: PropTypes.shape ({ index: PropTypes.string }),
  actionResolver: PropTypes.func
};

RequestsList.defaultProps = {
  indexpath: routes.request,
  actionResolver: () => false
};

export default RequestsList;
