import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';
import WorkflowsFilterToolbar from '../../PresentationalComponents/Workflow/WorkflowsFilterToolbar';
import { fetchWorkflows } from '../../redux/Actions/WorkflowActions';
import { fetchRequests } from '../../redux/Actions/RequestActions';
import AddWorkflow from './add-workflow-modal';
import RemoveWorkflow from './remove-workflow-modal';
import WorkflowList from './WorkflowList';
import './workflow.scss';
import { scrollToTop } from '../../Helpers/Shared/helpers';
import { fetchRequestsByWorkflowId } from '../../redux/Actions/WorkflowActions';

class Workflows extends Component {
    state = {
      filteredItems: [],
      isOpen: false,
      filterValue: ''
    };

    fetchData = () => {
      this.props.fetchWorkflows();
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
          <WorkflowsFilterToolbar onFilterChange={ this.onFilterChange } filterValue={ this.state.filterValue }/>
          <ToolbarGroup>
            <ToolbarItem>
              <Link to="/workflows/add-workflow">
                <Button
                  variant="primary"
                  aria-label="Create Workflow"
                >
                Create Workflow
                </Button>
              </Link>
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      );
    }

    render() {
      let filteredItems = {
        items: this.props.workflows
        .filter(({ name }) => name.toLowerCase().includes(this.state.filterValue.trim().toLowerCase())),
        isLoading: this.props.isLoading && this.props.workflows.length === 0
      };

      return (
        <Fragment>
          <Route exact path="/workflows/add-workflow" component={ AddWorkflow } />
          <Route exact path="/workflows/edit/:id" component={ AddWorkflow } />
          <Route exact path="/workflows/remove/:id" component={ RemoveWorkflow } />
          <Section type='content'>
            { this.renderToolbar() }
            <WorkflowList { ...filteredItems } noItems={ 'No Workflows' } fetchRequestsBYWorkflowId={ this.props.fetchRequestsByWorkflowId} />
          </Section>
        </Fragment>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    workflows: state.workflowReducer.workflows,
    requests: state.requestReducer.requests,
    isLoading: state.workflowReducer.isLoading,
    searchFilter: state.requestReducer.filterValue
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWorkflows: apiProps => dispatch(fetchWorkflows(apiProps)),
    fetchRequestsByWorkflowId: apiProps => dispatch(fetchRequestsByWorkflowId(apiProps)),
    fetchRequests: apiProps => dispatch(fetchRequests(apiProps))
  };
};

Workflows.propTypes = {
  filteredItems: propTypes.array,
  workflows: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  fetchWorkflows: propTypes.func.isRequired,
  fetchRequests: propTypes.func.isRequired,
  fetchRequestsByWorkflowId: propTypes.func.isRequired
};

Workflows.defaultProps = {
  workflows: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflows);
