import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import debouncePromise from 'awesome-debounce-promise';
import { Toolbar, ToolbarGroup, ToolbarItem, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, expandable } from '@patternfly/react-table';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { fetchRequests } from '../../redux/actions/request-actions';
import AddComment from './add_comment-modal';
import ApproveRequest from './approve-request-modal';
import DenyRequest from './deny-request-modal';
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

class Requests extends Component {
    state = {
      filteredItems: [],
      isOpen: false,
      filterValue: '',
      rows: []
    };

    fetchData = () => {
      this.props.fetchRequests().then(() => this.setState({ rows: createInitialRows(this.props.requests) }));
    };

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    componentDidUpdate(prevProps) {
      if (!isEqual(this.props.requests, prevProps.requests)) {
        this.setState({ rows: createInitialRows(this.props.requests) });
      }
    }

    handleOnPerPageSelect = limit => this.props.fetchRequests({
      offset: this.props.pagination.offset,
      limit
    }).then(() => this.setState({ rows: createInitialRows(this.props.requests) }));

    handleSetPage = (number, debounce) => {
      const options = {
        offset: getNewPage(number, this.props.pagination.limit),
        limit: this.props.pagination.limit
      };
      const request = () => this.props.fetchRequests(options);
      if (debounce) {
        return debouncePromise(request, 250)();
      }

      return request().then(() => this.setState({ rows: createInitialRows(this.props.requests) }));
    }

    setOpen = (data, id) => data.map(row => {
      if (row.id === id) {
        return {
          ...row,
          isOpen: !row.isOpen
        };
      }

      return { ...row };
    });

    setSelected = (data, id) => data.map(row => {
      if (row.id === id) {
        return {
          ...row,
          selected: !row.selected
        };
      }

      return { ...row };
    })

    onFilterChange = filterValue => this.setState({ filterValue })

    onCollapse = (_event, _index, _isOpen, { id }) => this.setState(({ rows }) => ({ rows: this.setOpen(rows, id) }));

    selectRow = (_event, selected, index, { id } = {}) => index === -1
      ? this.setState(({ rows }) => ({ rows: rows.map(row => ({ ...row, selected })) }))
      : this.setState(({ rows }) => ({ rows: this.setSelected(rows, id) }));

    renderToolbar() {
      return (
        <TableToolbar>
          <Level style={ { flex: 1 } }>
            <LevelItem>
              <Toolbar>
                <FilterToolbar onFilterChange={ this.onFilterChange } searchValue={ this.state.filterValue } placeholder='Find a Request' />
              </Toolbar>
            </LevelItem>

            <LevelItem>
              <Toolbar>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Pagination
                      itemsPerPage={ this.props.pagination.limit || 50 }
                      numberOfItems={ this.props.pagination.count || 50 }
                      onPerPageSelect={ this.handleOnPerPageSelect }
                      page={ getCurrentPage(this.props.pagination.limit, this.props.pagination.offset) }
                      onSetPage={ this.handleSetPage }
                      direction="down"
                    />
                  </ToolbarItem>
                </ToolbarGroup>
              </Toolbar>
            </LevelItem>
          </Level>
        </TableToolbar>
      );
    }

    actionResolver = (requestData, { rowIndex }) => {
      if (rowIndex === 1) {
        return null;
      }

      return [
        {
          title: 'Comment',
          onClick: (event, rowId, request) =>
            this.props.history.push(`/requests/add_comment/${request.id}`)
        }
      ];
    };

    render() {
      return (
        <Fragment>
          <Route exact path="/requests/add_comment/:id" component={ AddComment } />
          <Route exact path="/requests/approve/:id" component={ ApproveRequest } />
          <Route exact path="/requests/deny/:id" component={ DenyRequest } />
          { this.renderToolbar() }
          <Table
            aria-label="Approval Requests table"
            onCollapse={ this.onCollapse }
            rows={ this.state.rows }
            cells={ columns }
            onSelect={ this.selectRow }
            actionResolver={ this.actionResolver }
          >
            <TableHeader />
            <TableBody />
          </Table>
        </Fragment>
      );
    }
}

const mapStateToProps = ({ requestReducer: { requests, isLoading, filterValue }}) => ({
  requests: requests.data,
  pagination: requests.meta,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => {
  return {
    fetchRequests: apiProps => dispatch(fetchRequests(apiProps))
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
