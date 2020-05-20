import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, Link, useHistory } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { expandable, sortable } from '@patternfly/react-table';
import { fetchWorkflows, expandWorkflow, sortWorkflows, setFilterValueWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-groups/add-workflow-wizard';
import EditWorkflowInfo from './edit-workflow-info-modal';
import EditWorkflowGroups from './edit-workflow-groups-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { createRows } from './workflow-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import routesLinks from '../../constants/routes';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ],
  transforms: [ sortable ]
},
{ title: 'Description', transforms: [ sortable ]},
{ title: 'Sequence', transforms: [ sortable ]}
];

const debouncedFilter = asyncDebounce(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(setFilterValueWorkflows(filter, meta));
    return dispatch(fetchWorkflows(meta))
    .then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const prepareChips = (filterValue) => filterValue ? [{
  category: 'Name',
  key: 'name',
  chips: [{ name: filterValue, value: filterValue }]
}] : [];

const initialState = (filterValue = '') => ({
  filterValue,
  isOpen: false,
  isFetching: true,
  isFiltering: false
});

const workflowsListState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    default:
      return state;
  }
};

const Workflows = () => {
  const [ selectedWorkflows, setSelectedWorkflows ] = useState([]);
  const { workflows: { data, meta }, sortBy, filterValueRedux } = useSelector(
    ({ workflowReducer: { workflows, sortBy, filterValue: filterValueRedux }}) => ({ workflows, sortBy, filterValueRedux })
    , shallowEqual
  );
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(
    workflowsListState,
    initialState(filterValueRedux)
  );

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(
      fetchWorkflows(defaultSettings)
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) => stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      { ...meta, offset: 0 }
    );
  };

  const tabItems = [{ eventKey: 0, title: 'Request queue', name: '/requests' },
    { eventKey: 1, title: 'Approval processes', name: '/workflows' }];

  const handlePagination = (pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(fetchWorkflows(pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const onSort = (_e, index, direction, { property }) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(sortWorkflows({ index, direction, property }));
    return dispatch(fetchWorkflows())
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  const routes = () => <Fragment>
    <Route exact path={ routesLinks.workflows.add } render={ props => <AddWorkflow { ...props }
      postMethod={ handlePagination } /> }/>
    <Route exact path={ routesLinks.workflows.editInfo } render={ props => <EditWorkflowInfo editType='info' { ...props }
      postMethod={ handlePagination } /> }/>
    <Route exact path={ routesLinks.workflows.editGroups } render={ props => <EditWorkflowGroups editType='groups' { ...props }
      postMethod={ handlePagination } /> }/>
    <Route exact path={ routesLinks.workflows.editSequence } render={ props => <EditWorkflowInfo editType='sequence' { ...props }
      postMethod={ handlePagination } /> }/>
    <Route exact path={ routesLinks.workflows.remove }
      render={ props => <RemoveWorkflow
        { ...props }
        ids={ selectedWorkflows }
        fetchData={ handlePagination }
        setSelectedWorkflows={ setSelectedWorkflows }
      /> }
    />
  </Fragment>;

  const actionResolver = (_workflowData, { rowIndex }) => rowIndex % 2 === 1 ?
    null
    : [
      {
        title: 'Edit info',
        onClick: (_event, _rowId, workflow) =>
          history.push({ pathname: routesLinks.workflows.editInfo, search: `?workflow=${workflow.id}` })
      },
      {
        title: 'Edit groups',
        onClick: (_event, _rowId, workflow) =>
          history.push({ pathname: routesLinks.workflows.editGroups, search: `?workflow=${workflow.id}` })
      },
      {
        title: 'Edit sequence',
        onClick: (_event, _rowId, workflow) =>
          history.push({ pathname: routesLinks.workflows.editSequence, search: `?workflow=${workflow.id}` })
      },
      {
        title: 'Delete',
        style: { color: 'var(--pf-global--danger-color--100)'	},
        onClick: (_event, _rowId, workflow) =>
          history.push({ pathname: routesLinks.workflows.remove, search: `?workflow=${workflow.id}` })
      }
    ];

  const setCheckedItems = (checkedWorkflows) =>
    setSelectedWorkflows(checkedWorkflows.map(wf => wf.id));

  const anyWorkflowsSelected = selectedWorkflows.length > 0;

  const toolbarButtons = () => <ToolbarGroup className={ `pf-u-pl-lg top-toolbar` }>
    <ToolbarItem>
      <Link id="add-workflow-link" to={ { pathname: routesLinks.workflows.add } }>
        <Button
          variant="primary"
          aria-label="Create approval process"
        >
          Create approval process
        </Button>
      </Link>
    </ToolbarItem>
    <ToolbarItem>
      <Link
        id="remove-multiple-workflows"
        className={ anyWorkflowsSelected ? '' : 'disabled-link' }
        to={ { pathname: routesLinks.workflows.remove } }
      >
        <Button
          variant="link"
          isDisabled={ !anyWorkflowsSelected }
          style={ { color: anyWorkflowsSelected ? 'var(--pf-global--danger-color--100)' : 'var(--pf-global--disabled-color--100)'	} }
          aria-label="Delete approval process"
        >
          Delete
        </Button>
      </Link>
    </ToolbarItem>
  </ToolbarGroup>;

  const onCollapse = (id, setRows, setOpen) => {
    dispatch(expandWorkflow(id));
    setRows((rows) => setOpen(rows, id));
  };

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle title="Approval"/>
        <AppTabs tabItems={ tabItems }/>
      </TopToolbar>
      <TableToolbarView
        sortBy={ sortBy }
        onSort={ onSort }
        data={ data }
        isSelectable={ true }
        createRows={ createRows }
        columns={ columns }
        fetchData={ handlePagination }
        routes={ routes }
        actionResolver={ actionResolver }
        titlePlural="approval processes"
        titleSingular="approval process"
        pagination={ meta }
        setCheckedItems={ setCheckedItems }
        toolbarButtons={ toolbarButtons }
        filterValue={ filterValue }
        onFilterChange={ handleFilterChange }
        isLoading={ isFetching || isFiltering }
        onCollapse={ onCollapse }
        renderEmptyState={ () => (
          <TableEmptyState
            title={ filterValue === '' ? 'No approval processes' : 'No results found' }
            Icon={ SearchIcon }
            PrimaryAction={ () =>
              filterValue !== '' ? (
                <Button onClick={ () => handleFilterChange('') } variant="link">
                  Clear all filters
                </Button>
              ) : null
            }
            description={
              filterValue === ''
                ? 'No approval processes.'
                : 'No results match the filter criteria. Remove all filters or clear all filters to show results.'
            }
          />
        ) }
        activeFiltersConfig={ {
          filters: prepareChips(filterValue),
          onDelete: () => handleFilterChange('')
        } }
      />
    </Fragment>
  );
};

export default Workflows;
