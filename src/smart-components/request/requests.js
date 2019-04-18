import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route } from 'react-router-dom';
import debouncePromise from 'awesome-debounce-promise';
import { Toolbar, ToolbarGroup, ToolbarItem, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, expandable } from '@patternfly/react-table';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { fetchRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import { scrollToTop, getCurrentPage, getNewPage } from '../../helpers/shared/helpers';
import { createInitialRows } from './request-table-helpers';
import FilterToolbar from '../../presentational-components/shared/filter-toolbar-item';
import { TableToolbar } from '@red-hat-insights/insights-frontend-components/components/TableToolbar';

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
  const [ filterValue, setFilterValue ] = useState([]);
  const [ rows, setRows ] = useState([]);

  const fetchData = () => {
    fetchRequests().then(({ value: { data }}) => setRows(createInitialRows(data)));
  };

  useEffect(() => {
    fetchData();
    scrollToTop();
  }, []);

  const handleOnPerPageSelect = limit => fetchRequests({
    offset: pagination.offset,
    limit
  }).then(() => setRows(createInitialRows(requests)));

  const handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, pagination.limit),
      limit: pagination.limit
    };
    const request = () => fetchRequests(options);
    return debounce ? debouncePromise(request, 250)() : request().then(({ value: { data }}) => setRows(createInitialRows(data)));
  };

  const setOpen = (data, id) => data.map(row => row.id === id ?
    {
      ...row,
      isOpen: !row.isOpen
    } : {
      ...row
    });

  const setSelected = (data, id) => data.map(row => row.id === id ?
    {
      ...row,
      selected: !row.selected
    } : {
      ...row
    });

  const onCollapse = (_event, _index, _isOpen, { id }) => setRows((rows) => setOpen(rows, id));

  const selectRow = (_event, selected, index, { id } = {}) => index === -1
    ? setRows(rows.map(row => ({ ...row, selected })))
    : setRows((rows) => setSelected(rows, id));

  const renderToolbar = () => <TableToolbar>
    <Level style={ { flex: 1 } }>
      <LevelItem>
        <Toolbar>
          <FilterToolbar onFilterChange={ value => setFilterValue(value) } searchValue={ filterValue } placeholder='Find a Request' />
        </Toolbar>
      </LevelItem>

      <LevelItem>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarItem>
              <Pagination
                itemsPerPage={ pagination.limit || 50 }
                numberOfItems={ pagination.count || 50 }
                onPerPageSelect={ handleOnPerPageSelect }
                page={ getCurrentPage(pagination.limit, pagination.offset) }
                onSetPage={ handleSetPage }
                direction="down"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </LevelItem>
    </Level>
  </TableToolbar>;

  const actionResolver = (requestData, { rowIndex }) => rowIndex === 1 ? null :
    [
      {
        title: 'Comment',
        onClick: () =>
          history.push(`/requests/add_comment/${requestData.id}`)
      }
    ];

  return (
    <Fragment>
      <Route exact path="/requests/add_comment/:id" render={ props => <ActionModal { ...props } actionType={ 'Add Comment' } /> }/>
      <Route exact path="/requests/approve/:id" render={ props => <ActionModal { ...props } actionType={ 'Approve' } /> } />
      <Route exact path="/requests/deny/:id" render={ props => <ActionModal { ...props } actionType={ 'Deny' } /> } />
      { renderToolbar() }
      <Table
        aria-label="Approval Requests table"
        onCollapse={ onCollapse }
        rows={ rows }
        cells={ columns }
        onSelect={ selectRow }
        actionResolver={ actionResolver }
      >
        <TableHeader />
        <TableBody />
      </Table>
    </Fragment>
  );
};

const mapStateToProps = ({ requestReducer: { requests, isLoading, filterValue }}) => ({
  requests: requests.data,
  pagination: requests.meta,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => ({
  fetchRequests: apiProps => dispatch(fetchRequests(apiProps))
});

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

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
