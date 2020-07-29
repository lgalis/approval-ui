import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, Link, useHistory } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { sortable, truncate } from '@patternfly/react-table';
import { fetchWorkflows, sortWorkflows, setFilterValueWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-workflow-modal';
import EditWorkflowInfo from './edit-workflow-info-modal';
import EditWorkflowGroups from './edit-workflow-groups-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { createRows } from './workflow-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { AppTabs } from '../../smart-components/app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import routesLinks from '../../constants/routes';
import { useIntl } from 'react-intl';
import commonMessages from '../../messages/common.message';
import worfklowMessages from '../../messages/workflows.messages';
import formMessages from '../../messages/form.messages';
import tableToolbarMessages from '../../messages/table-toolbar.messages';

const columns = (intl) => [
  { title: intl.formatMessage(worfklowMessages.sequence), transforms: [ sortable ]},
  {
    title: intl.formatMessage(tableToolbarMessages.name),
    transforms: [ sortable ]
  },
  { title: intl.formatMessage(formMessages.description), transforms: [ sortable ], cellTransforms: [ truncate ]},
  { title: intl.formatMessage(formMessages.groups) }
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

const prepareChips = (filterValue, intl) => filterValue ? [{
  category: intl.formatMessage(tableToolbarMessages.name),
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
  const intl = useIntl();

  const updateWorkflows = (pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchWorkflows(pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  useEffect(() => {
    updateWorkflows(defaultSettings);
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

  const onSort = (_e, index, direction, { property }) => {
    dispatch(sortWorkflows({ index, direction, property }));
    return updateWorkflows();
  };

  const routes = () => <Fragment>
    <Route exact path={ routesLinks.workflows.add } render={ props => <AddWorkflow { ...props }
      postMethod={ updateWorkflows } /> }/>
    <Route exact path={ routesLinks.workflows.editInfo } render={ props => <EditWorkflowInfo editType='info' { ...props }
      postMethod={ updateWorkflows } /> }/>
    <Route exact path={ routesLinks.workflows.editGroups } render={ props => <EditWorkflowGroups editType='groups' { ...props }
      postMethod={ updateWorkflows } /> }/>
    <Route exact path={ routesLinks.workflows.editSequence } render={ props => <EditWorkflowInfo editType='sequence' { ...props }
      postMethod={ updateWorkflows } /> }/>
    <Route exact path={ routesLinks.workflows.remove }
      render={ props => <RemoveWorkflow
        { ...props }
        ids={ selectedWorkflows }
        fetchData={ updateWorkflows }
        setSelectedWorkflows={ setSelectedWorkflows }
      /> }
    />
  </Fragment>;

  const actionResolver = () => [
    {
      title: intl.formatMessage(worfklowMessages.editInfo),
      component: 'button',
      onClick: (_event, _rowId, workflow) =>
        history.push({ pathname: routesLinks.workflows.editInfo, search: `?workflow=${workflow.id}` })
    },
    {
      title: intl.formatMessage(worfklowMessages.editGroups),
      component: 'button',
      onClick: (_event, _rowId, workflow) =>
        history.push({ pathname: routesLinks.workflows.editGroups, search: `?workflow=${workflow.id}` })
    },
    {
      title: intl.formatMessage(worfklowMessages.editSequence),
      component: 'button',
      onClick: (_event, _rowId, workflow) =>
        history.push({ pathname: routesLinks.workflows.editSequence, search: `?workflow=${workflow.id}` })
    },
    {
      title: intl.formatMessage(commonMessages.delete),
      component: 'button',
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
          aria-label={ intl.formatMessage(formMessages.create) }
        >
          { intl.formatMessage(formMessages.create) }
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
          variant="secondary"
          isDisabled={ !anyWorkflowsSelected }
          aria-label={ intl.formatMessage(worfklowMessages.deleteApprovalTitle) }
        >
          { intl.formatMessage(commonMessages.delete) }
        </Button>
      </Link>
    </ToolbarItem>
  </ToolbarGroup>;

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle title={ intl.formatMessage(commonMessages.approvalTitle) }/>
        <AppTabs/>
      </TopToolbar>
      <TableToolbarView
        sortBy={ sortBy }
        onSort={ onSort }
        data={ data }
        isSelectable={ true }
        createRows={ createRows }
        columns={ columns(intl) }
        fetchData={ updateWorkflows }
        routes={ routes }
        actionResolver={ actionResolver }
        titlePlural={ intl.formatMessage(worfklowMessages.approvalProcesses) }
        titleSingular={ intl.formatMessage(worfklowMessages.approvalProcess) }
        pagination={ meta }
        setCheckedItems={ setCheckedItems }
        toolbarButtons={ toolbarButtons }
        filterValue={ filterValue }
        onFilterChange={ handleFilterChange }
        isLoading={ isFetching || isFiltering }
        renderEmptyState={ () => (
          <TableEmptyState
            title={ filterValue === ''
              ? intl.formatMessage(worfklowMessages.noApprovalProcesses)
              : intl.formatMessage(tableToolbarMessages.noResultsFound)
            }
            Icon={ SearchIcon }
            PrimaryAction={ () =>
              filterValue !== '' ? (
                <Button onClick={ () => handleFilterChange('') } variant="link">
                  { intl.formatMessage(tableToolbarMessages.clearAllFilters) }
                </Button>
              ) : null
            }
            description={
              filterValue === ''
                ? intl.formatMessage(worfklowMessages.noApprovalProcesses)
                : intl.formatMessage(tableToolbarMessages.clearAllFiltersDescription)
            }
          />
        ) }
        activeFiltersConfig={ {
          filters: prepareChips(filterValue, intl),
          onDelete: () => handleFilterChange('')
        } }
      />
    </Fragment>
  );
};

export default Workflows;
