import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { IntlProvider } from 'react-intl';
import Workflows from '../../../smart-components/workflow/workflows';
import workflowReducer, { workflowsInitialState } from '../../../redux/reducers/workflow-reducer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { groupsInitialState } from '../../../redux/reducers/group-reducer';
import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import EditWorkflowInfoModal from '../../../smart-components/workflow/edit-workflow-info-modal';
import EditWorkflowGroupsModal from '../../../smart-components/workflow/edit-workflow-groups-modal';
import RemoveWorkflowModal from '../../../smart-components/workflow/remove-workflow-modal';
import AddWorkflowWizard from '../../../smart-components/workflow/add-groups/add-workflow-wizard';
import { Table, RowWrapper } from '@patternfly/react-table';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import routes from '../../../constants/routes';

const ComponentWrapper = ({ store, initialEntries = [ routes.workflows.index ], children }) => (
  <Provider store={ store }>
    <MemoryRouter initialEntries={ initialEntries }>
      <IntlProvider locale="en">
        { children }
      </IntlProvider>
    </MemoryRouter>
  </Provider>
);

describe('<Workflows />', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let stateWithData;

  beforeEach(() => {
    apiClientMock.reset();
    mockStore = configureStore(middlewares);
    stateWithData = {
      groupReducer: { ...groupsInitialState },
      workflowReducer: {
        ...workflowsInitialState,
        workflows: {
          data: [{
            id: 'edit-id',
            name: 'foo',
            group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
          }],
          meta: {
            count: 0,
            limit: 10,
            offset: 0
          }
        },
        workflow: {},
        filterValue: '',
        isLoading: false,
        isRecordLoading: false,
        sortBy: {
          index: 1,
          property: 'sequence',
          direction: 'asc'
        }
      }
    };
  });

  it('should redirect to Edit info page', async () => {
    jest.useFakeTimers();

    const store = mockStore(stateWithData);
    let wrapper;
    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`, mockOnce({ body: { data: [{
        id: 'edit-id',
        name: 'foo',
        group_refs: [ 'group-1' ]
      }]}}));

    // async name validator
    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=foo&limit=50&offset=0`,
      mockOnce({
        body: {
          data: [{
            id: 'edit-id',
            name: 'foo',
            group_refs: [ 'group-1' ]
          }
          ]
        }
      })
    );
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on edit info action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('button.pf-c-dropdown__menu-item').first().simulate('click');
    });

    wrapper.update();

    await act(async () => {
      jest.runAllTimers(); // debounced async call
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.editInfo);
    expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?workflow=edit-id');
    expect(wrapper.find(EditWorkflowInfoModal)).toHaveLength(1);

    jest.useRealTimers();
  });

  it('should redirect to Edit approval process groups page', async () => {
    jest.useFakeTimers();

    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`, mockOnce({
        body: {
          data: [{
            id: 'edit-id',
            name: 'foo',
            group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
          }]
        }
      })
    );
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: [{ uuid: 'id', name: 'name' }]}}));
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on edit groups action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('button.pf-c-dropdown__menu-item').at(1).simulate('click');
    });

    await act(async () => {
      jest.runAllTimers(); // debounced async call
    });
    wrapper.update();

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.editGroups);
    expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?workflow=edit-id');
    expect(wrapper.find(EditWorkflowGroupsModal)).toHaveLength(1);

    jest.useRealTimers();
  });

  it('should redirect to Edit sequence page', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`, mockOnce({ body: { data: [{
        id: 'edit-id',
        name: 'foo',
        group_refs: [ 'group-1' ]
      }]}}));

    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on edit info action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('button.pf-c-dropdown__menu-item').at(2).simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.editSequence);
    expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?workflow=edit-id');
    expect(wrapper.find(EditWorkflowInfoModal)).toHaveLength(1);
  });

  it('should redirect to Delete approval process page', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`, mockOnce({ body: { data: [{
        id: 'edit-id',
        name: 'foo',
        group_refs: [ 'group-1' ]
      }]}}));

    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on delete action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('button.pf-c-dropdown__menu-item').at(3).simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.remove);
    expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?workflow=edit-id');
    expect(wrapper.find(RemoveWorkflowModal)).toHaveLength(1);
  });

  it('should redirect to add approval process page', async () => {
    jest.useFakeTimers();

    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`, mockOnce({ body: { data: [{
        id: 'edit-id',
        name: 'foo',
        group_refs: [ 'group-1' ],
        group_names: [ 'group-name-1' ]
      }]}}));

    // async name validator
    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({
        body: {
          data: [{
            id: 'edit-id',
            name: 'foo',
            group_refs: [ 'group-1' ]
          }]
        }
      })
    );

    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Click on add approval process link
     */
    await act(async () => {
      wrapper.find('Link#add-workflow-link').simulate('click', { button: 0 });
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers(); // debounced async call
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.add);
    expect(wrapper.find(AddWorkflowWizard)).toHaveLength(1);

    jest.useRealTimers();
  });

  it('should remove multiple selected workflows from table', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce({ body: { data: [{
        id: 'edit-id',
        name: 'foo',
        group_refs: [ 'group-1' ],
        group_names: [ 'group-name-1' ]
      }]}})
    );

    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    wrapper.find('input[type="checkbox"]').last().simulate('change', { target: { checked: true }});
    wrapper.find('Link#remove-multiple-workflows').simulate('click', { button: 0 });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.remove);
    expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('');
    expect(wrapper.find(RemoveWorkflowModal)).toHaveLength(1);
  });

  it('should expand approval process', async () => {
    const id = 'edit-id';

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce({ body: { data: [{
        id,
        name: 'foo',
        group_refs: [ 'group-1' ]
      }],
      meta: {
        count: 1,
        limit: 50,
        offset: 0
      }}})
    );

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ workflowReducer: applyReducerHash(workflowReducer, workflowsInitialState) });
    const storeReal = registry.getStore();

    let wrapper;
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ storeReal }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    expect(wrapper.find(RowWrapper)).toHaveLength(2); // one item + expanded

    await act(async () => {
      wrapper.find(Table).props().onCollapse({}, {}, {}, { id });
    });
    wrapper.update();
    expect(storeReal.getState().workflowReducer.expandedWorkflows).toEqual([ id ]);
  });

  it('should sort', async () => {
    expect.assertions(3);

    const wf = {
      id: 'so',
      name: 'foo',
      group_refs: [ 'group-1' ]
    };

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce({
        status: 200,
        body: {
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ wf ]
        }
      })
    );

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ workflowReducer: applyReducerHash(workflowReducer, workflowsInitialState) });
    const storeReal = registry.getStore();

    let wrapper;
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ storeReal }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'name:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ wf ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(11).simulate('click'); // name column
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'name:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ wf ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(11).simulate('click'); // name column
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=description%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'description:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ wf ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(12).simulate('click'); // description column
    });
    wrapper.update();
  });

  it('should filter and clear the filter', async () => {
    jest.useFakeTimers();
    expect.assertions(2);

    const wf = {
      id: 'so',
      name: 'foo',
      group_refs: [ 'group-1' ]
    };

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce({
        status: 200,
        body: {
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ wf ]
        }
      })
    );

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ workflowReducer: applyReducerHash(workflowReducer, workflowsInitialState) });
    const storeReal = registry.getStore();

    let wrapper;
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ storeReal }>
          <Route path={ routes.workflows.index } component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=some-name&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name', limit: '50', offset: '0', sort_by: 'sequence:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ wf ]
        });
      })
    );

    await act(async () => {
      wrapper.find('input').first().instance().value = 'some-name';
      wrapper.find('input').first().simulate('change');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'sequence:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ wf ]
        });
      })
    );

    await act(async () => {
      wrapper.find('.ins-c-chip-filters').find('button').last().simulate('click');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    jest.useRealTimers();
  });
});
