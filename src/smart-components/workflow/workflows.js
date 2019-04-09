import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import debouncePromise from 'awesome-debounce-promise';
import { Section } from '@red-hat-insights/insights-frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, expandable } from '@patternfly/react-table';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { fetchWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-workflow-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { scrollToTop, getCurrentPage, getNewPage } from '../../helpers/shared/helpers';
import { fetchRbacGroups } from '../../redux/actions/rbac-actions';
import { createInitialRows } from './workflow-table-helpers';
import WorkflowsFilterToolbar from '../../presentational-components/workflow/workflows-filter-toolbar';
import './workflow.scss';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
'Description',
'Members'
];

class Workflows extends Component {
    state = {
      filteredItems: [],
      isOpen: false,
      filterValue: '',
      rows: []
    };

    fetchData = () => {
      this.props.fetchWorkflows().then(() => this.setState({ rows: createInitialRows(this.props.workflows) }));
      this.props.fetchRbacGroups();
    };

    componentDidMount() {
      this.fetchData();
      scrollToTop();
    }

    componentDidUpdate(prevProps) {
      if (this.props.workflows !== prevProps.workflows) {
        this.setState({ rows: createInitialRows(this.props.workflows) });
      }
    }

    handleOnPerPageSelect = limit => this.props.fetchWorkflows({
      offset: this.props.pagination.offset,
      limit
    }).then(() => this.setState({ rows: createInitialRows(this.props.workflows) }));

    handleSetPage = (number, debounce) => {
      const options = {
        offset: getNewPage(number, this.props.pagination.limit),
        limit: this.props.pagination.limit
      };
      const request = () => this.props.fetchWorkflows(options);
      if (debounce) {
        return debouncePromise(request, 250)();
      }

      return request().then(() => this.setState({ rows: createInitialRows(this.props.workflows) }));
    }

    setOpen = (data, uuid) => data.map(row => {
      if (row.uuid === uuid) {
        return {
          ...row,
          isOpen: !row.isOpen
        };
      }

      return { ...row };
    });

    setSelected = (data, uuid) => data.map(row => {
      if (row.uuid === uuid) {
        return {
          ...row,
          selected: !row.selected
        };
      }

      return { ...row };
    })

    onFilterChange = filterValue => this.setState({ filterValue })

    onCollapse = (_event, _index, _isOpen, { uuid }) => this.setState(({ rows }) => ({ rows: this.setOpen(rows, uuid) }));

    selectRow = (_event, selected, index, { uuid } = {}) => index === -1
      ? this.setState(({ rows }) => ({ rows: rows.map(row => ({ ...row, selected })) }))
      : this.setState(({ rows }) => ({ rows: this.setSelected(rows, uuid) }));

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
      );
    }

    actionResolver = (workflowData, { rowIndex }) => {
      if (rowIndex === 1) {
        return null;
      }

      return [
        {
          title: 'Edit',
          onClick: (event, rowId, workflow) =>
            this.props.history.push(`/workflows/edit/${workflow.uuid}`)
        },
        {
          title: 'Delete',
          onClick: (event, rowId, workflow) =>
            this.props.history.push(`/workflows/remove/${workflow.id}`)
        }
      ];
    };

    render() {
      return (
        <Fragment>
          <Route exact path="/workflows/add-workflow" component={ AddWorkflow } />
          <Route exact path="/workflows/edit/:id" component={ AddWorkflow } />
          <Route exact path="/workflows/remove/:id" component={ RemoveWorkflow } />
          <Section type='content'>
            { this.renderToolbar() }
            <Table
              aria-label="Approval Workflows table"
              onCollapse={ this.onCollapse }
              rows={ this.state.rows }
              cells={ columns }
              onSelect={ this.selectRow }
              actionResolver={ this.actionResolver }
            >
              <TableHeader />
              <TableBody />
            </Table>
          </Section>
        </Fragment>
      );
    }
}

const mapStateToProps = ({ workflowReducer: { workflows, isLoading }, rbacReducer: { rbacGroups, filterValue }}) => ({
  workflows: workflows.data,
  pagination: workflows.meta,
  rbacGroups,
  isLoading,
  searchFilter: filterValue
});

const mapDispatchToProps = dispatch => {
  return {
    fetchWorkflows: apiProps => dispatch(fetchWorkflows(apiProps)),
    fetchRbacGroups: apiProps => dispatch(fetchRbacGroups(apiProps))
  };
};

Workflows.propTypes = {
  history: propTypes.shape({
    goBack: propTypes.func.isRequired,
    push: propTypes.func.isRequired
  }).isRequired,
  filteredItems: propTypes.array,
  workflows: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  searchFilter: propTypes.string,
  fetchWorkflows: propTypes.func.isRequired,
  fetchRbacGroups: propTypes.func.isRequired,
  pagination: propTypes.shape({
    limit: propTypes.number.isRequired,
    offset: propTypes.number.isRequired,
    count: propTypes.number.isRequired
  })
};

Workflows.defaultProps = {
  workflows: [],
  pagination: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflows);
