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
import RemoveWorkflowModal from '../../../smart-components/workflow/remove-workflow-modal';
import AddWorkflowModal from '../../../smart-components/workflow/add-workflow-modal';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import routes from '../../../constants/routes';
import TableEmptyState from '../../../presentational-components/shared/table-empty-state';
import * as edit from '../../../smart-components/workflow/edit-workflow-modal';

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
            group_refs: [{ name: 'group-1', uuid: 'some-uuid' }],
            sequence: 1
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
          index: 2,
          property: 'sequence',
          direction: 'asc'
        }
      }
    };
  });

  it('should redirect to Edit info page', async () => {
    edit.default = jest.fn().mockImplementation(() => <span />);

    jest.useFakeTimers();

    const store = mockStore(stateWithData);
    let wrapper;
    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`, mockOnce({ body: { data: [{
        id: 'edit-id',
        name: 'foo',
        sequence: 1,
        group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
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
      wrapper.find('button.pf-c-dropdown__menu-item').first().simulate('click');
    });

    wrapper.update();

    await act(async () => {
      jest.runAllTimers(); // debounced async call
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.edit);
    expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?workflow=edit-id');
    expect(wrapper.find(edit.default)).toHaveLength(1);

    jest.useRealTimers();
  });

  it('should redirect to Delete approval process page', async () => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`, mockOnce({ body: { data: [{
        id: 'edit-id',
        name: 'foo',
        sequence: 1,
        group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
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
      wrapper.find('button.pf-c-dropdown__menu-item').last().simulate('click');
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
        sequence: 1,
        group_refs: [{ name: 'group-1', uuid: 'some-uuid' }],
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
            sequence: 1,
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
    expect(wrapper.find(AddWorkflowModal)).toHaveLength(1);

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
        sequence: 1,
        group_refs: [{ name: 'group-1', uuid: 'some-uuid' }],
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

  it('should sort', async () => {
    expect.assertions(3);

    const wf = {
      id: 'so',
      name: 'foo',
      sequence: 1,
      group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
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
      wrapper.find('button').at(12).simulate('click'); // name column
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
      wrapper.find('button').at(12).simulate('click'); // name column
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
      wrapper.find('button').at(13).simulate('click'); // description column
    });
    wrapper.update();
  });

  it('should filter and clear the filter', async () => {
    jest.useFakeTimers();
    expect.assertions(2);

    const wf = {
      id: 'so',
      name: 'foo',
      sequence: 1,
      group_refs: [{ name: 'group-1', uuid: 'some-uuid' }]
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

  it('should render table empty state', async () => {
    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce({
        status: 200,
        body: {
          meta: { count: 0, limit: 50, offset: 0 },
          data: [ ]
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

    expect(wrapper.find(TableEmptyState)).toHaveLength(1);
  });

  it('should paginate requests', async () => {
    jest.useFakeTimers();
    expect.assertions(2);

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
      mockOnce({
        status: 200,
        body: {
          meta: { count: 40, limit: 50, offset: 0 },
          data: [ ]
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

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=10&offset=0&sort_by=sequence%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '10', offset: '0', sort_by: 'sequence:asc'
        });
        return res.status(200).body({
          meta: { count: 40, limit: 10, offset: 0 },
          data: [ ]
        });
      })
    );

    await act(async () => {
      wrapper.find('.pf-c-options-menu__toggle-button').first().simulate('click');
    });
    wrapper.update();
    await act(async () => {
      wrapper.find('.pf-c-options-menu__menu-item').first().simulate('click');
    });
    wrapper.update();
    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=10&offset=10&sort_by=sequence%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '10', offset: '10', sort_by: 'sequence:asc'
        });
        return res.status(200).body({
          meta: { count: 40, limit: 10, offset: 10 },
          data: [ ]
        });
      })
    );

    await act(async () => {
      wrapper.find('.pf-c-pagination__nav').first().find('button').last().simulate('click');
    });
    wrapper.update();
    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    jest.useRealTimers();
  });

  it('should move workflow by using buttons', async () => {
    jest.useFakeTimers();
    expect.assertions(1);

    const wf = {
      id: '987',
      name: 'foo',
      sequence: 10,
      group_refs: []
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

    await act(async () => {
      wrapper.find(`button#down-${wf.id}`).simulate('click');
    });
    wrapper.update();

    // PATCH WF
    apiClientMock.patch(`${APPROVAL_API_BASE}/workflows/${wf.id}`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ id: wf.id, sequence: wf.sequence + 1 });
      return res.status(200).body({ foo: 'bar' });
    }));

    // RELOAD WORKFLOWS
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

    await act(async () => {
      jest.runAllTimers(); // debounced async call
    });
    wrapper.update();

    jest.useRealTimers();
  });

  it('should move workflow by using buttons, multiple clicks', async () => {
    jest.useFakeTimers();
    expect.assertions(1);

    const wf = {
      id: '987',
      name: 'foo',
      sequence: 10,
      group_refs: []
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

    await act(async () => {
      wrapper.find(`button#down-${wf.id}`).simulate('click');
    });
    wrapper.update();
    await act(async () => {
      wrapper.find(`button#down-${wf.id}`).simulate('click');
    });
    wrapper.update();
    await act(async () => {
      wrapper.find(`button#down-${wf.id}`).simulate('click');
    });
    wrapper.update();

    // PATCH WF
    apiClientMock.patch(`${APPROVAL_API_BASE}/workflows/${wf.id}`, mockOnce((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ id: wf.id, sequence: wf.sequence + 3 });
      return res.status(200).body({ foo: 'bar' });
    }));

    // RELOAD WORKFLOWS
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

    await act(async () => {
      jest.runAllTimers(); // debounced async call
    });
    wrapper.update();

    jest.useRealTimers();
  });

  describe('table removal actions', () => {
    const wf1 = {
      id: '123',
      name: 'wf1',
      selected: true,
      sequence: 1,
      group_refs: []
    };
    const wf2 = {
      id: '456',
      name: 'wf2',
      selected: true,
      sequence: 1,
      group_refs: [ ]
    };
    const wf3 = {
      id: '789',
      name: 'wf',
      selected: true,
      sequence: 1,
      group_refs: [ ]
    };
    let storeReal;

    beforeEach(() => {
      apiClientMock.reset();
      apiClientMock.get(
        `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
        mockOnce({
          status: 200,
          body: {
            meta: { count: 3, limit: 50, offset: 0 },
            data: [ wf1, wf2, wf3 ]
          }
        })
      );

      const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
      registry.register({ workflowReducer: applyReducerHash(workflowReducer, workflowsInitialState) });
      storeReal = registry.getStore();
    });

    it('should select all workflows and delete them', async () => {
      expect.assertions(7);

      let wrapper;
      await act(async()=> {
        wrapper = mount(
          <ComponentWrapper store={ storeReal }>
            <Route path={ routes.workflows.index } component={ Workflows } />
          </ComponentWrapper>
        );
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('input[type="checkbox"]').first().getDOMNode().checked = true;
        wrapper.find('input[type="checkbox"]').first().simulate('change', { target: { checked: true }});
      });
      wrapper.update();
      await act(async () => {
        wrapper.find('Link#remove-multiple-workflows').simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find('ModalBoxBody').find('p').text()).toEqual('3 approval processes will be removed.');

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.remove);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('');

      // Delete endpoints
      apiClientMock.delete(
        `${APPROVAL_API_BASE}/workflows/123`,
        mockOnce((_req, res) => {
          expect(true).toEqual(true); // just check that it was called
          return res.status(200);
        })
      );

      apiClientMock.delete(
        `${APPROVAL_API_BASE}/workflows/456`,
        mockOnce((_req, res) => {
          expect(true).toEqual(true); // just check that it was called
          return res.status(200);
        })
      );

      apiClientMock.delete(
        `${APPROVAL_API_BASE}/workflows/789`,
        mockOnce((_req, res) => {
          expect(true).toEqual(true); // just check that it was called
          return res.status(200);
        })
      );

      // wf refresh
      apiClientMock.get(
        `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
        mockOnce((req, res) => {
          expect(req.url().query).toEqual({
            'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'sequence:asc'
          });
          return res.status(200).body({
            meta: { count: 0, limit: 50, offset: 0 },
            data: [ ]
          });
        })
      );

      await act(async () => {
        wrapper.find('button#submit-remove-workflow').simulate('click');
      });
    });

    it('should select and deselect all workflows', async () => {
      let wrapper;
      await act(async()=> {
        wrapper = mount(
          <ComponentWrapper store={ storeReal }>
            <Route path={ routes.workflows.index } component={ Workflows } />
          </ComponentWrapper>
        );
      });
      wrapper.update();

      expect(wrapper.find('Link#remove-multiple-workflows').find('button').props().disabled).toEqual(true);

      await act(async () => {
        wrapper.find('input[type="checkbox"]').first().getDOMNode().checked = true;
        wrapper.find('input[type="checkbox"]').first().simulate('change');
      });
      wrapper.update();

      expect(wrapper.find('Link#remove-multiple-workflows').find('button').props().disabled).toEqual(false);

      await act(async () => {
        wrapper.find('input[type="checkbox"]').first().getDOMNode().checked = false;
        wrapper.find('input[type="checkbox"]').first().simulate('change');
      });
      wrapper.update();

      expect(wrapper.find('Link#remove-multiple-workflows').find('button').props().disabled).toEqual(true);
    });

    it('should select only one workflow and delete it', async () => {
      expect.assertions(5);

      let wrapper;
      await act(async()=> {
        wrapper = mount(
          <ComponentWrapper store={ storeReal }>
            <Route path={ routes.workflows.index } component={ Workflows } />
          </ComponentWrapper>
        );
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('input[type="checkbox"]').at(1).simulate('change', { target: { checked: true }});
      });
      wrapper.update();
      await act(async () => {
        wrapper.find('Link#remove-multiple-workflows').simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find('ModalBoxBody').find('p').text()).toEqual('wf1 will be removed.');
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.workflows.remove);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('');

      // Delete endpoints
      apiClientMock.delete(
        `${APPROVAL_API_BASE}/workflows/123`,
        mockOnce((_req, res) => {
          expect(true).toEqual(true); // just check that it was called
          return res.status(200);
        })
      );

      // wf refresh
      apiClientMock.get(
        `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=sequence%3Aasc`,
        mockOnce((req, res) => {
          expect(req.url().query).toEqual({
            'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'sequence:asc'
          });
          return res.status(200).body({
            meta: { count: 0, limit: 50, offset: 0 },
            data: [ ]
          });
        })
      );

      await act(async () => {
        wrapper.find('button#submit-remove-workflow').simulate('click');
      });
    });
  });
});
