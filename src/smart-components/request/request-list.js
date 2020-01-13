import React, { Fragment, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { SearchIcon } from '@patternfly/react-icons';
import { Section } from '@redhat-cloud-services/frontend-components';
import { isRequestStateActive, scrollToTop } from '../../helpers/shared/helpers';
import ToolbarRenderer from '../../toolbar/toolbar-renderer';
import { defaultSettings } from '../../helpers/shared/pagination';
import {
  createRequestsFilterToolbarSchema
} from '../../toolbar/schemas/requests-toolbar.schema';
import { fetchRequests } from '../../redux/actions/request-actions';
import ContentListEmptyState from '../../presentational-components/shared/content-list-empty-state';
import asyncDebounce from '../../utilities/async-debounce';
import ContentList from '../../presentational-components/shared/content-list';
import AsyncPagination from '../common/async-pagination';
import BottomPaginationContainer from '../../presentational-components/shared/bottom-pagination-container';
import { expandable } from '@patternfly/react-table/dist/js/index';
import ActionModal from './action-modal';
import { createRows } from './request-table-helpers';
import RequestDetail from './request-detail/request-detail';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';

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

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
'Requester',
'Opened',
'Updated',
'State',
'Decision'
];

const RequestsList = () => {
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(
    requestsListState,
    initialState
  );
  const { data, meta } = useSelector(
    ({ requestReducer: { requests }}) => requests
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const debouncedFilter = asyncDebounce(
    (value, dispatch, filteringCallback, meta = defaultSettings) => {
      filteringCallback(true);
      dispatch(fetchRequests({ ...meta, filter: { name: { contains: value }}}).then(() =>
        filteringCallback(false))
      );
    },
    1000
  );
  useEffect(() => {
    dispatch(
      fetchRequests({ ...defaultSettings, filter: { name: { contains: filterValue }}})
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

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' }, { eventKey: 1, title: 'Workflows', name: '/workflows' }];

  const routes = () => <Fragment>
    <Route exact path="/requests/add_comment/:id" render={ props => <ActionModal { ...props }
      actionType={ 'Add Comment' }/> }/>
    <Route exact path="/requests/approve/:id" render={ props => <ActionModal { ...props } actionType={ 'Approve' }/> } />
    <Route exact path="/requests/deny/:id" render={ props => <ActionModal { ...props } actionType={ 'Deny' }/> } />
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

  const renderRequestsList = () => {
    const requestsRows = data ? createRows(data) : [];
    const title = 'Approval';
    return (
      <Fragment>
        <TopToolbar>
          <TopToolbarTitle title="Approval" />
          <AppTabs tabItems={ tabItems }/>
        </TopToolbar>
        <ToolbarRenderer
          schema={ createRequestsFilterToolbarSchema({
            onFilterChange: handleFilterChange,
            searchValue: filterValue,
            filterPlaceholder: 'Filter by name...',
            meta,
            apiRequest: (_, options) =>
              dispatch(fetchRequests({ ...options, filter: { name: { contains: filterValue }}}))
          }) }
        />
        { routes() }
        <Section type="content">
          <ContentList
            title={ title }
            data={ requestsRows }
            columns={ columns }
            isLoading={ isFetching || isFiltering }
            actionResolver={ actionResolver }
            renderEmptyState={ () => (
              <ContentListEmptyState
                title="No inventories"
                Icon={ SearchIcon }
                description={
                  filterValue === ''
                    ? 'No inventories found.'
                    : 'No inventories match your filter criteria.'
                }
              />
            ) }
          />
        </Section>

        { meta.count > 0 && (
          <BottomPaginationContainer>
            <AsyncPagination
              dropDirection="up"
              meta={ meta }
              apiRequest={ (_, options) =>
                dispatch(fetchRequests({ ...options, filter: { name: { contains: filterValue }}}))
              }
            />
          </BottomPaginationContainer>
        ) }
      </Fragment>
    );
  };

  return (
    <Switch>
      <Route path={ '/requests/detail/:id' } render={ props => <RequestDetail { ...props }/> } />
      <Route path={ '/requests' } render={ () => renderRequestsList() } />
    </Switch>
  );
};

RequestsList.propTypes = {
  isPlatformDataLoading: PropTypes.bool,
  platform: PropTypes.shape({
    name: PropTypes.string
  }),
  title: PropTypes.string,
  platformInventories: PropTypes.arrayOf(PropTypes.shape({})),
  paginationCurrent: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number
  })
};

RequestsList.defaultProps = {
  requests: [],
  paginationCurrent: {
    limit: 50,
    offset: 0
  }
};
export default RequestsList;
