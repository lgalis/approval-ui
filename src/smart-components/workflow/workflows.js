import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import debouncePromise from 'awesome-debounce-promise';
import { Toolbar, ToolbarGroup, ToolbarItem, Button, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, expandable } from '@patternfly/react-table';
import { Pagination } from '@red-hat-insights/insights-frontend-components/components/Pagination';
import { fetchWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-workflow-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { scrollToTop, getCurrentPage, getNewPage } from '../../helpers/shared/helpers';
import { fetchRbacGroups } from '../../redux/actions/group-actions';
import { createInitialRows } from './workflow-table-helpers';
import FilterToolbar from '../../presentational-components/shared/filter-toolbar-item';
import { TableToolbar } from '@red-hat-insights/insights-frontend-components/components/TableToolbar';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
'Description',
'Groups'
];

const Workflows = ({ fetchRbacGroups, fetchWorkflows, pagination, workflows, history }) => {
  const [ filterValue, setFilterValue ] = useState('');
  const [ rows, setRows ] = useState([]);

  const fetchData = () => {
    fetchRbacGroups();
    fetchWorkflows().then(({ value: { data }}) => setRows(createInitialRows(data)));
  };

  useEffect(() => {
    fetchData();
    scrollToTop();
  }, []);

  const handleOnPerPageSelect = limit => fetchWorkflows({
    offset: pagination.offset,
    limit
  }).then(() => setRows(createInitialRows(workflows)));

  const handleSetPage = (number, debounce) => {
    const options = {
      offset: getNewPage(number, pagination.limit),
      limit: pagination.limit
    };
    const request = () => fetchWorkflows(options);
    return debounce ? debouncePromise(request, 250)() : request().then(({ value: { data }}) => setRows(createInitialRows(data)));
  };

  const setOpen = (data, id) => data.map(row => row.id === id ?
    {
      ...row,
      isOpen: !row.isOpen
    } : {
      ...row
    });

  const setSelected = (data, id) => data.map(row => row.id === id ?
    {
      ...row,
      selected: !row.selected
    } : {
      ...row
    });

  const onCollapse = (_event, _index, _isOpen, { id }) => setRows((rows) => setOpen(rows, id));

  const selectRow = (_event, selected, index, { id } = {}) => index === -1
    ? setRows(rows.map(row => ({ ...row, selected })))
    : setRows((rows) => setSelected(rows, id));

  const renderToolbar = () => <TableToolbar>
    <Level style={ { flex: 1 } }>
      <LevelItem>
        <Toolbar>
          <FilterToolbar onFilterChange={ value => setFilterValue(value) } searchValue={ filterValue } placeholder='Find a Workflow' />
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
      </LevelItem>

      <LevelItem>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarItem>
              <Pagination
                itemsPerPage={ pagination.limit || 50 }
                numberOfItems={ pagination.count || 50 }
                onPerPageSelect={ handleOnPerPageSelect }
                page={ getCurrentPage(pagination.limit, pagination.offset) }
                onSetPage={ handleSetPage }
                direction="down"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </LevelItem>
    </Level>
  </TableToolbar>;

  const actionResolver = (workflowData, { rowIndex }) => rowIndex === 1 ?
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

  return (<Fragment>
    <Route exact path="/workflows/add-workflow" component={ AddWorkflow } />
    <Route exact path="/workflows/edit/:id" component={ AddWorkflow } />
    <Route exact path="/workflows/remove/:id" component={ RemoveWorkflow } />
    { renderToolbar() }
    <Table
      aria-label="Approval Workflows table"
      onCollapse={ onCollapse }
      rows={ rows }
      cells={ columns }
      onSelect={ selectRow }
      actionResolver={ actionResolver }
    >
      <TableHeader />
      <TableBody />
    </Table>

  </Fragment>);
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
