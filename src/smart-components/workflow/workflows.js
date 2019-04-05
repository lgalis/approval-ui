import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { Section } from '@red-hat-insights/insights-frontend-components';
import WorkflowsFilterToolbar from '../../presentational-components/workflow/workflows-filter-toolbar';
import { fetchWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-workflow-modal';
import RemoveWorkflow from './remove-workflow-modal';
import WorkflowList from './workflow-list';
import './workflow.scss';
import { scrollToTop } from '../../helpers/shared/helpers';

class Workflows extends Component {
    state = {
      filteredItems: [],
      isOpen: false,
      filterValue: ''
    };

    fetchData = () => {
      this.props.fetchWorkflows();
    };

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    onFilterChange = filterValue => this.setState({ filterValue });

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
        items: this.props.workflows,
        isLoading: this.props.isLoading && this.props.workflows.length === 0
      };

      return (
        <Fragment>
          <Route exact path="/workflows/add-workflow" component={ AddWorkflow } />
          <Route exact path="/workflows/edit/:id" component={ AddWorkflow } />
          <Route exact path="/workflows/remove/:id" component={ RemoveWorkflow } />
          <Section type='content'>
            { this.renderToolbar() }
            <WorkflowList { ...filteredItems } noItems={ 'No Workflows' }/>
          </Section>
        </Fragment>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    workflows: state.workflowReducer.workflows,
    isLoading: state.workflowReducer.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWorkflows: apiProps => dispatch(fetchWorkflows(apiProps))
  };
};

Workflows.propTypes = {
  filteredItems: propTypes.array,
  workflows: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  fetchWorkflows: propTypes.func.isRequired
};

Workflows.defaultProps = {
  workflows: []
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflows);
