import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { expandable } from '@patternfly/react-table';
import { fetchRequests, expandRequest } from '../../redux/actions/request-actions';
import { createRows } from './request-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import RequestDetail from './request-detail/request-detail';
import { isApprovalApprover } from '../../helpers/shared/helpers';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { AppTabs } from '../../smart-components/app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import { SearchIcon } from '@patternfly/react-icons/dist/js/index';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import UserContext from '../../user-context';
import useQuery from '../../utilities/use-query';

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

const AllRequests = () => {
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(
    requestsListState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ requestReducer: { requests }}) => requests
  );
  const { userPersona: userPersona } = useContext(UserContext);
  const dispatch = useDispatch();
  const [{ request }] = useQuery([ 'request' ]);

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
          { isApprovalApprover(userPersona) && <AppTabs/> }
        </TopToolbar>
        <TableToolbarView
          data={ data }
          createRows={ createRows }
          columns={ columns }
          fetchData={ handlePagination }
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

AllRequests.propTypes = {
  requests: PropTypes.array,
  isLoading: PropTypes.bool
};

AllRequests.defaultProps = {
  requests: [],
  isLoading: false
};

export default AllRequests;
