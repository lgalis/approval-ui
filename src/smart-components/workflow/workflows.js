import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
'Description',
'Sequence'
];

const Workflows = ({ fetchWorkflows, isLoading, pagination, history }) => {
  const [ selectedWorkflows, setSelectedWorkflows ] = useState([]);
  const [ filterValue, setFilterValue ] = useState(undefined);
  const [ workflows, setWorkflows ] = useState([]);

  const fetchData = () => {
    fetchWorkflows({ ...pagination, name: filterValue }).then(({ value: { data }}) => setWorkflows(data));
  };

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' },
    { eventKey: 1, title: 'Workflows', name: '/workflows' }];

  const routes = () => <Fragment>
    <Route exact path="/workflows/add-workflow" render={ props => <AddWorkflow { ...props }
      postMethod={ fetchData } /> }/>
    <Route exact path="/workflows/edit-info/:id" render={ props => <EditWorkflowInfo editType='info' { ...props }
      postMethod={ fetchData } /> }/>
    <Route exact path="/workflows/edit-stages/:id" render={ props => <EditWorkflowStages editType='stages' { ...props }
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
        onClick: (_event, _rowId, workflow) =>
          history.push(`/workflows/edit-info/${workflow.id}`)
      },

      {
        title: 'Edit groups',
        onClick: (_event, _rowId, workflow) =>
          history.push(`/workflows/edit-stages/${workflow.id}`)
      },

      {
        title: 'Delete',
        style: { color: 'var(--pf-global--danger-color--100)'	},
        onClick: (_event, _rowId, workflow) =>
          history.push(`/workflows/remove/${workflow.id}`)
      }
    ];

  const setCheckedItems = (checkedWorkflows) =>
    setSelectedWorkflows (checkedWorkflows.map(wf => wf.id));

  const anyWorkflowsSelected = () => selectedWorkflows.length > 0;

  const toolbarButtons = () => <ToolbarGroup>
    <ToolbarItem>
      <Link id="add-workflow-link" to="/workflows/add-workflow">
        <Button
          variant="primary"
          aria-label="Create workflow"
        >
          Create workflow
        </Button>
      </Link>
    </ToolbarItem>
    <ToolbarItem>
      <Link id="remove-multiple-workflows" className={ anyWorkflowsSelected() ? '' : 'disabled-link' } to={ { pathname: '/workflows/remove' } }>
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
        setCheckedItems={ setCheckedItems }
        toolbarButtons={ toolbarButtons }
        filterValue={ filterValue }
        setFilterValue={ setFilterValue }
        isLoading={ isLoading }
      />
    </Fragment>
  );
};

const mapStateToProps = ({ workflowReducer: { workflows, isLoading }}) => ({
  workflows: workflows.data,
  pagination: workflows.meta,
  isLoading
});

const mapDispatchToProps = dispatch => {
  return {
    fetchWorkflows: apiProps => dispatch(fetchWorkflows(apiProps)),
    fetchRbacGroups: apiProps => dispatch(fetchRbacGroups(apiProps))
  };
};

Workflows.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  workflows: PropTypes.array,
  platforms: PropTypes.array,
  isLoading: PropTypes.bool,
  fetchWorkflows: PropTypes.func.isRequired,
  selectedWorkflows: PropTypes.array,
  pagination: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired
  })
};

Workflows.defaultProps = {
  workflows: [],
  rbacGroups: {},
  isLoading: false,
  pagination: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflows);
