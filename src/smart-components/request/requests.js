import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Toolbar } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';
import RequestList from './request-list';
import RequestsFilterToolbar from '../../presentational-components/Request/RequestsFilterToolbar';
import { fetchRequests } from '../../redux/actions/request-actions';
import AddRequest from './add-request-modal';
import './request.scss';
import { scrollToTop } from '../../helpers/shared/helpers';

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
      <Toolbar className="searchToolbar">
        <RequestsFilterToolbar onFilterChange={ this.onFilterChange } filterValue={ this.state.filterValue } />
      </Toolbar>
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
        <Section type='content'>
          { this.renderToolbar() }
          <RequestList { ...filteredItems } noItems={ 'No Requests' } />
        </Section>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    requests: state.requestReducer.requests,
    isLoading: state.requestReducer.isRequestDataLoading,
    workflows: state.workflowReducer.workflows,
    searchFilter: state.requestReducer.filterValue
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRequests: apiProps => dispatch(fetchRequests(apiProps))
  };
};

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
