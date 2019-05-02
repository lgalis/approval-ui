import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { expandable } from '@patternfly/react-table';
import { fetchWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-workflow-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { fetchRbacGroups } from '../../redux/actions/group-actions';
import { createInitialRows } from './workflow-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
'Description',
'Groups'
];

const Workflows = ({ fetchRbacGroups, fetchWorkflows, workflows, pagination, history }) => {
  const fetchData = (setRows) => {
    fetchRbacGroups();
    fetchWorkflows().then(({ value: { data }}) => setRows(createInitialRows(data)));
  };

  const routes = () => <Fragment>
    <Route exact path="/workflows/add-workflow" component={ AddWorkflow } />
    <Route exact path="/workflows/edit/:id" component={ AddWorkflow } />
    <Route exact path="/workflows/remove/:id" component={ RemoveWorkflow } />
  </Fragment>;

  const actionResolver = (workflowData, { rowIndex }) => rowIndex % 2 === 1 ?
    null
    : [
      {
        title: 'Edit',
        onClick: (event, rowId, workflow) =>
          history.push(`/workflows/edit/${workflow.id}`)
      },
      {
        title: 'Delete',
        style: { color: 'var(--pf-global--danger-color--100)'	},
        onClick: (event, rowId, workflow) =>
          history.push(`/workflows/remove/${workflow.id}`)
      }
    ];

  const toolbarButtons = () => <ToolbarGroup>
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
  </ToolbarGroup>;

  return (
    <Fragment>
      <TableToolbarView
        data={ workflows }
        isSelectable={ true }
        createInitialRows={ createInitialRows }
        columns={ columns }
        fetchData={ fetchData }
        request={ fetchWorkflows }
        routes={ routes }
        actionResolver={ actionResolver }
        titlePlural="Workflows"
        titleSingular="Workflow"
        pagination={ pagination }
        toolbarButtons={ toolbarButtons }
      />
    </Fragment>
  );
};

const mapStateToProps = ({ workflowReducer: { workflows, isLoading }, groupReducer: { groups, filterValue }}) => ({
  workflows: workflows.data,
  pagination: workflows.meta,
  rbacGroups: groups,
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
