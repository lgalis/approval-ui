import React, { Fragment, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Link, useHistory } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { expandable } from '@patternfly/react-table';
import { fetchWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-stages/add-stages-wizard';
import EditWorkflowInfo from './edit-workflow-info-modal';
import EditWorkflowStages from './edit-workflow-stages-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { createRows } from './workflow-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import AppTabs from '../../smart-components/app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
'Description',
'Sequence'
];

const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

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
  const [{ filterValue, isFetching, isFiltering }, stateDispatch ] = useReducer(
    workflowsListState,
    initialState
  );

  const fetchData = () => {
    fetchWorkflows(filterValue, meta);
  };

  const { data, meta } = useSelector(
    ({ workflowReducer: { workflows }}) => workflows
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const debouncedFilter = asyncDebounce(
    (value, dispatch, filteringCallback, meta = defaultSettings) => {
      filteringCallback(true);
      dispatch(fetchWorkflows(value, meta)).then(() =>
        filteringCallback(false)
      );
    },
    1000
  );

  useEffect(() => {
    dispatch(
      fetchWorkflows(filterValue, defaultSettings)
    ).then(() => stateDispatch({ type: 'setFetching', payload: false }));
    scrollToTop();
  }, []);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) =>
        stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      {
        ...meta,
        offset: 0
      }
    );
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

  const handlePagination = (_apiProps, pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    dispatch(fetchWorkflows(filterValue, pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

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

  const renderList = () => {
    return (
      <Fragment>
        <TopToolbar>
          <TopToolbarTitle title="Approval"/>
          <AppTabs tabItems={ tabItems }/>
        </TopToolbar>
        <TableToolbarView
          data={ data }
          isSelectable={ true }
          createRows={ createRows }
          columns={ columns }
          fetchData={ fetchData }
          request={ handlePagination }
          routes={ routes }
          actionResolver={ actionResolver }
          titlePlural="workflows"
          titleSingular="workflow"
          pagination={ meta }
          setCheckedItems={ setCheckedItems }
          toolbarButtons={ toolbarButtons }
          filterValue={ filterValue }
          setFilterValue={ handleFilterChange }
          isLoading={ isFetching || isFiltering }
        />
      </Fragment>
    );
  };

  return renderList();
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

export default Workflows;
