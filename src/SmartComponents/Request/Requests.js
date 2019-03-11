import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';
import RequestList from './RequestList';
import RequestsFilterToolbar from '../../PresentationalComponents/Request/RequestsFilterToolbar';
import { fetchRequests } from '../../redux/Actions/RequestActions';
import { fetchWorkflows } from '../../redux/Actions/WorkflowActions';
import AddRequest from './add-request-modal';
import RemoveRequest from './remove-request-modal';
import './request.scss';
import { scrollToTop } from '../../Helpers/Shared/helpers';
import { fetchWorkflowsByRequestId } from '../../redux/Actions/RequestActions';

class Requests extends Component {
    state = {
      filteredItems: [],
      isOpen: false,
      filterValue: ''
    };

    fetchData = () => {
      this.props.fetchRequests();
      this.props.fetchWorkflows();
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
      items: this.props.requests
      .filter(({ email }) => email.toLowerCase().includes(this.state.filterValue.trim().toLowerCase())),
      isLoading: this.props.isLoading && this.props.requests.length === 0
    };

    return (
      <Fragment>
        <Route exact path="/requests/add-request" component={ AddRequest } />
        <Route exact path="/requests/edit/:id" component={ AddRequest } />
        <Route exact path="/requests/remove/:id" component={ RemoveRequest } />
        <Section type='content'>
          { this.renderToolbar() }
          <RequestList { ...filteredItems } noItems={ 'No Principals' } fetchWorkflowsByRequestId={ this.props.fetchWorkflowsByRequestId }/>
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
    fetchRequests: apiProps => dispatch(fetchRequests(apiProps)),
    fetchWorkflowsByRequestId: apiProps => dispatch(fetchWorkflowsByRequestId(apiProps)),
    fetchWorkflows: apiProps => dispatch(fetchWorkflows(apiProps))
  };
};

Requests.propTypes = {
  filteredItems: propTypes.array,
  requests: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  fetchRequests: propTypes.func.isRequired,
  fetchWorkflows: propTypes.func.isRequired,
  fetchWorkflowsByRequestId: propTypes.func.isRequired
};

Requests.defaultProps = {
  requests: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
