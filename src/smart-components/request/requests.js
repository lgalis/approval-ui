import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Toolbar, ToolbarGroup, Level } from '@patternfly/react-core';
import RequestList from './request-list';
import FilterToolbar from '../../presentational-components/shared/filter-toolbar-item';
import { fetchRequests } from '../../redux/actions/request-actions';
import AddRequest from './add-request-modal';
import { scrollToTop } from '../../helpers/shared/helpers';
import { TableToolbar } from '@red-hat-insights/insights-frontend-components/components/TableToolbar';

class Requests extends Component {
  state = {
    filteredItems: [],
    isOpen: false,
    filterValue: ''
  };

  fetchData = () => {
    this.props.fetchRequests();
  };

  componentDidMount() {
    this.fetchData();
    scrollToTop();
  }

  onFilterChange = filterValue => this.setState({ filterValue })

  renderToolbar() {
    return (
      <TableToolbar>
        <Level style={ { flex: 1 } }>
          <Toolbar>
            <ToolbarGroup>
              <Toolbar>
                <FilterToolbar onFilterChange={ this.onFilterChange } searchValue={ this.state.filterValue } placeholder='Find a Request' />
              </Toolbar>
            </ToolbarGroup>
          </Toolbar>
        </Level>
      </TableToolbar>
    );
  }

  render() {
    let filteredItems = {
      items: this.props.requests,
      isLoading: this.props.isLoading && this.props.requests.length === 0
    };

    return (
      <Fragment>
        <Route exact path="/requests/edit/:id" component={ AddRequest } />
        { this.renderToolbar() }
        <RequestList { ...filteredItems } noItems={ 'No Requests' } />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  requests: state.requestReducer.requests,
  isLoading: state.requestReducer.isRequestDataLoading,
  workflows: state.workflowReducer.workflows,
  searchFilter: state.requestReducer.filterValue
});

const mapDispatchToProps = dispatch => ({
  fetchRequests: apiProps => dispatch(fetchRequests(apiProps))
});

Requests.propTypes = {
  filteredItems: propTypes.array,
  requests: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  fetchRequests: propTypes.func.isRequired
};

Requests.defaultProps = {
  requests: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
