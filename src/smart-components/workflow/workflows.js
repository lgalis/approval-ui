import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { expandable } from '@patternfly/react-table';
import { fetchWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-stages/add-stages-wizard';
import EditWorkflowInfo from './edit-workflow-info-modal';
import EditWorkflowStages from './edit-workflow-stages-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { fetchRbacGroups } from '../../redux/actions/group-actions';
import { createRows } from './workflow-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
'Description'
];

const Workflows = ({ fetchRbacGroups, fetchWorkflows, isLoading, pagination, history, rbacGroups }) => {
  const [ selectedWorkflows, setSelectedWorkflows ] = useState([]);
  const [ filterValue, setFilterValue ] = useState(undefined);
  const [ workflows, setWorkflows ] = useState([]);

  useEffect(() => {
    fetchRbacGroups();
  }, []);

  const fetchData = () => {
    fetchWorkflows().then(({ value: { data }}) => setWorkflows(data));
  };

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' },
    { eventKey: 1, title: 'Workflows', name: '/workflows' }];

  const routes = () => <Fragment>
    <Route exact path="/workflows/add-workflow" render={ props => <AddWorkflow { ...props }
      postMethod={ fetchData } /> }/>
    <Route exact path="/workflows/edit-info/:id" render={ props => <EditWorkflowInfo editType= 'info' { ...props }
      postMethod={ fetchData } /> }/>
    <Route exact path="/workflows/edit-stages/:id" render={ props => <EditWorkflowStages editType= 'stages' rbacGroups={ rbacGroups }{ ...props }
      postMethod={ fetchData } /> }/>
    <Route exact path="/workflows/remove/:id"
      render={ props => <RemoveWorkflow { ...props }
        fetchData={ fetchData }
        setSelectedWorkflows={ setSelectedWorkflows } /> }/>
    <Route exact path="/workflows/remove"
      render={ props => <RemoveWorkflow { ...props }
        ids={ selectedWorkflows }
        fetchData={ fetchData }
        setSelectedWorkflows={ setSelectedWorkflows } /> }/>
  </Fragment>;

  const actionResolver = (workflowData, { rowIndex }) => rowIndex % 2 === 1 ?
    null
    : [
      {
        title: 'Edit info',
        onClick: (event, rowId, workflow) =>
          history.push(`/workflows/edit-info/${workflow.id}`)
      },
      {
        title: 'Edit stages',
        onClick: (event, rowId, workflow) =>
          history.push(`/workflows/edit-stages/${workflow.id}`)
      },

      {
        title: 'Delete',
        style: { color: 'var(--pf-global--danger-color--100)'	},
        onClick: (event, rowId, workflow) =>
          history.push(`/workflows/remove/${workflow.id}`)
      }
    ];

  const setCheckedWorkflows = (checkedWorkflows) =>
    setSelectedWorkflows (checkedWorkflows.map(wf => wf.id));

  const anyWorkflowsSelected = () => selectedWorkflows.length > 0;

  const toolbarButtons = () => <ToolbarGroup>
    <ToolbarItem>
      <Link to="/workflows/add-workflow">
        <Button
          variant="primary"
          aria-label="Create workflow"
        >
          Create workflow
        </Button>
      </Link>
    </ToolbarItem>
    <ToolbarItem>
      <Link className= { anyWorkflowsSelected() ? '' : 'disabled-link' } to={ { pathname: '/workflows/remove' } }>
        <Button
          variant="link"
          isDisabled={ !anyWorkflowsSelected() }
          style={ { color: anyWorkflowsSelected() ? 'var(--pf-global--danger-color--100)' : 'var(--pf-global--disabled-color--100)'	} }
          aria-label="Delete Workflow"
        >
          Delete
        </Button>
      </Link>
    </ToolbarItem>
  </ToolbarGroup>;

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle title="Approval" />
        <AppTabs tabItems={ tabItems }/>
      </TopToolbar>
      <TableToolbarView
        data={ workflows }
        isSelectable={ true }
        createRows={ createRows }
        columns={ columns }
        fetchData={ fetchData }
        request={ fetchWorkflows }
        routes={ routes }
        actionResolver={ actionResolver }
        titlePlural="workflows"
        titleSingular="workflow"
        pagination={ pagination }
        setCheckedItems={ setCheckedWorkflows }
        toolbarButtons={ toolbarButtons }
        filterValue={ filterValue }
        setFilterValue={ setFilterValue }
        isLoading={ isLoading }
      />
    </Fragment>
  );
};

const mapStateToProps = ({ workflowReducer: { workflows, isLoading }, groupReducer: { groups }}) => ({
  workflows: workflows.data,
  pagination: workflows.meta,
  rbacGroups: groups,
  isLoading
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
  workflows: propTypes.array,
  platforms: propTypes.array,
  isLoading: propTypes.bool,
  fetchWorkflows: propTypes.func.isRequired,
  fetchRbacGroups: propTypes.func.isRequired,
  selectedWorkflows: propTypes.array,
  rbacGroups: propTypes.array,
  pagination: propTypes.shape({
    limit: propTypes.number.isRequired,
    offset: propTypes.number.isRequired,
    count: propTypes.number.isRequired
  })
};

Workflows.defaultProps = {
  workflows: [],
  rbacGroups: {},
  isLoading: false,
  pagination: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflows);
