/* eslint-disable camelcase */
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { IntlProvider } from 'react-intl';
import Requests from '../../../smart-components/request/requests';
import requestReducer, { requestsInitialState } from '../../../redux/reducers/request-reducer';
import { act } from 'react-dom/test-utils';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { RowWrapper } from '@patternfly/react-table';
import { Table } from '@patternfly/react-table';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import TableEmptyState from '../../../presentational-components/shared/table-empty-state';
import UserContext from '../../../user-context';
import routes from '../../../constants/routes';
import ActionModal from '../../../smart-components/request/action-modal';
import { APPROVAL_APPROVER_ROLE } from '../../../helpers/shared/helpers';

const roles = {};
roles[APPROVAL_APPROVER_ROLE] = true;

const ComponentWrapper = ({ store, initialEntries = [ '/requests' ], children }) => (
  <UserContext.Provider value={ { userRoles: roles } } >
    <Provider store={ store } >
      <MemoryRouter initialEntries={ initialEntries }>
        <IntlProvider locale="en">
          { children }
        </IntlProvider>
      </MemoryRouter>
    </Provider>
  </UserContext.Provider>
);

describe('<Requests />', () => {
  let initialProps;

  const request = {
    id: '299',
    state: 'notified',
    decision: 'undecided',
    workflow_id: '1',
    created_at: '2020-01-08T19:37:59Z',
    notified_at: '2020-01-08T19:37:59Z',
    number_of_children: 0,
    number_of_finished_children: 0,
    owner: 'jsmith@redhat.com',
    requester_name: 'John Smith',
    name: 'QA Password survey field'
  };

  beforeEach(() => {
    initialProps = {};
  });

  it('should open row in the table and load its data', async () => {
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
      status: 200,
      body: {
        meta: { count: 1, limit: 50, offset: 0 },
        data: [ request ]
      }
    }));

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
    const store = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(<ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>);
    });
    wrapper.update();

    expect(wrapper.find(RowWrapper)).toHaveLength(2); // one item + expanded

    const contentSpy = jest.fn().mockImplementation(mockOnce({
      status: 200,
      body: {
        product: 'CostManagement',
        platform: 'Linux',
        portfolio: 'Very'
      }
    }));

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/${request.id}/content`, contentSpy);

    await act(async () => {
      wrapper.find(Table).props().onCollapse({}, {}, {}, { id: request.id });
    });
    wrapper.update();

    expect(contentSpy).toHaveBeenCalled();
    expect(store.getState().requestReducer.expandedRequests).toEqual([ request.id ]);
  });

  it('should sort requests when click on sort', async () => {
    expect.assertions(3);

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
      status: 200,
      body: {
        meta: { count: 1, limit: 50, offset: 0 },
        data: [ request ]
      }
    }));

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
    const store = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(<ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>);
    });
    wrapper.update();

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=name%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          limit: '50', offset: '0', sort_by: 'name:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(5).simulate('click'); // name column
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=name%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          limit: '50', offset: '0', sort_by: 'name:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(5).simulate('click'); // name column
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=requester_name%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          limit: '50', offset: '0', sort_by: 'requester_name:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(6).simulate('click'); // requester column
    });
    wrapper.update();
  });

  it('should filter requests - and clear filters', async () => {
    jest.useFakeTimers();
    expect.assertions(7);

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
      status: 200,
      body: {
        meta: { count: 1, limit: 50, offset: 0 },
        data: [ request ]
      }
    }));

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
    const store = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(<ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>);
    });
    wrapper.update();

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=some-name&limit=50&offset=0&sort_by=created_at%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name', limit: '50', offset: '0', sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
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

    // Switch to requester name filter
    await act(async () => {
      wrapper.find('ConditionalFilter').setState({ stateValue: 1 });
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=some-name&filter%5Brequester_name%5D%5Bcontains_i%5D=some-requester`
       + `&limit=50&offset=0&sort_by=created_at%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name',
          'filter[requester_name][contains_i]': 'some-requester',
          limit: '50',
          offset: '0',
          sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      wrapper.find('input').first().instance().value = 'some-requester';
      wrapper.find('input').first().simulate('change');
    });
    wrapper.update();
    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    // Switch to status filter
    await act(async () => {
      wrapper.find('ConditionalFilter').setState({ stateValue: 2 });
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=some-name&filter%5Brequester_name%5D%5Bcontains_i%5D=some-requester`
       + '&filter%5Bstate%5D%5Beq%5D%5B%5D=canceled&filter%5Bstate%5D%5Beq%5D%5B%5D=started'
      + '&limit=50&offset=0&sort_by=created_at%3Adesc',
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name',
          'filter[requester_name][contains_i]': 'some-requester',
          'filter[state][eq][]': [ 'canceled', 'started' ],
          limit: '50',
          offset: '0',
          sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    const checkboxDropdownProps = wrapper.find('Select').last().props();

    const EVENT = {};
    await act(async () => {
      checkboxDropdownProps.onSelect(EVENT, 'canceled');
    });
    wrapper.update();
    await act(async () => {
      checkboxDropdownProps.onSelect(EVENT, 'started');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=some-name&filter%5Brequester_name%5D%5Bcontains_i%5D=some-requester`
       + '&filter%5Bstate%5D%5Beq%5D%5B%5D=started'
      + '&limit=50&offset=0&sort_by=created_at%3Adesc',
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name',
          'filter[requester_name][contains_i]': 'some-requester',
          'filter[state][eq][]': 'started',
          limit: '50',
          offset: '0',
          sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      checkboxDropdownProps.onSelect(EVENT, 'canceled');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=some-name&filter%5Brequester_name%5D%5Bcontains_i%5D=some-requester`
       + '&filter%5Bstate%5D%5Beq%5D%5B%5D=started'
       + '&filter%5Bdecision%5D%5Beq%5D%5B%5D=approved'
      + '&limit=50&offset=0&sort_by=created_at%3Adesc',
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name',
          'filter[requester_name][contains_i]': 'some-requester',
          'filter[state][eq][]': 'started',
          'filter[decision][eq][]': 'approved',
          limit: '50',
          offset: '0',
          sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    // Switch to descision filter
    await act(async () => {
      wrapper.find('ConditionalFilter').setState({ stateValue: 3 });
    });
    wrapper.update();

    await act(async () => {
      const checkboxDropdownPropsDecision = wrapper.find('Select').last().props();
      checkboxDropdownPropsDecision.onSelect(EVENT, 'approved');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=some-name&filter%5Brequester_name%5D%5Bcontains_i%5D=some-requester`
       + '&filter%5Bstate%5D%5Beq%5D%5B%5D=started'
      + '&limit=50&offset=0&sort_by=created_at%3Adesc',
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': 'some-name',
          'filter[requester_name][contains_i]': 'some-requester',
          'filter[state][eq][]': 'started',
          limit: '50',
          offset: '0',
          sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    // clear one chip
    await act(async () => {
      wrapper.find('.pf-c-chip').last().find('button').simulate('click');
    });
    wrapper.update();
    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          limit: '50',
          offset: '0',
          sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    // clear chips
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

  it('should paginate requests', async () => {
    jest.useFakeTimers();
    expect.assertions(2);

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
      status: 200,
      body: {
        meta: { count: 1, limit: 50, offset: 0 },
        data: [ request ]
      }
    }));

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
    const store = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(<ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>);
    });
    wrapper.update();

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=10&offset=0&sort_by=created_at%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          limit: '10', offset: '0', sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 30, limit: 10, offset: 0 },
          data: [ request ]
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

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=10&offset=10&sort_by=created_at%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          limit: '10', offset: '10', sort_by: 'created_at:desc'
        });
        return res.status(200).body({
          meta: { count: 30, limit: 10, offset: 0 },
          data: [ request ]
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

  it('should render table empty state', async () => {
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
      status: 200,
      body: {
        meta: { count: 0, limit: 50, offset: 0 },
        data: [ ]
      }
    }));

    const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
    registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
    const store = registry.getStore();

    let wrapper;
    await act(async () => {
      wrapper = mount(<ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>);
    });
    wrapper.update();

    expect(wrapper.find(TableEmptyState)).toHaveLength(1);
  });

  describe('Actions', () => {
    const request = {
      id: '703',
      state: 'notified',
      decision: 'undecided',
      workflow_id: '168',
      created_at: '2020-05-13T13:35:48Z',
      notified_at: '2020-05-13T13:36:29Z',
      number_of_children: 0,
      number_of_finished_children: 0,
      owner: 'insights-qa',
      requester_name: 'Insights QA',
      name: 'Hello World',
      group_name: 'Test Approval Group',
      parent_id: '702',
      metadata: {
        user_capabilities: { show: true, create: true, approve: true, cancel: false, deny: true, memo: true }
      }
    };

    const contentData = {
      params: {
        quest: 'Test Approval',
        airspeed: 3,
        username: 'insights-qa',
        int_value: 5
      },
      product: 'Hello World',
      order_id: '654',
      platform: 'Dev Public Ansible Tower (18.188.178.206)',
      portfolio: 'LGTestNoTags'
    };

    beforeEach(() => {
      apiClientMock.get(`${APPROVAL_API_BASE}/requests/?limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
        status: 200,
        body: {
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        }
      }));
    });

    it('should open comment modal from the list', async () => {
      const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
      registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
      const store = registry.getStore();

      let wrapper;
      await act(async () => {
        wrapper = mount(
          <ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>
        );
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('.pf-c-table__action').first().find('.pf-c-dropdown__toggle').simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(ActionModal)).toHaveLength(0);
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.requests.index);

      await act(async () => {
        wrapper.find('.pf-c-table__action').first().find('.pf-c-dropdown__menu').find('button').simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(ActionModal).props().actionType).toEqual('Add Comment');
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.requests.addComment);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?request=703');
    });

    it('should open approve modal from the list', async () => {
      apiClientMock.get(`${APPROVAL_API_BASE}/requests/703/content`, mockOnce({
        status: 200,
        body: contentData
      }));

      const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
      registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
      const store = registry.getStore();

      let wrapper;
      await act(async () => {
        wrapper = mount(
          <ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>
        );
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('.pf-c-table__toggle').first().find('button').simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(ActionModal)).toHaveLength(0);
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.requests.index);

      await act(async () => {
        wrapper.find('.pf-c-table__expandable-row').first().find('a').first().simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find(ActionModal).props().actionType).toEqual('Approve');
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.requests.approve);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?request=703');
    });

    it('should open deny modal from the list', async () => {
      apiClientMock.get(`${APPROVAL_API_BASE}/requests/703/content`, mockOnce({
        status: 200,
        body: contentData
      }));

      const registry = new ReducerRegistry({}, [ thunk, promiseMiddleware() ]);
      registry.register({ requestReducer: applyReducerHash(requestReducer, requestsInitialState) });
      const store = registry.getStore();

      let wrapper;
      await act(async () => {
        wrapper = mount(
          <ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>
        );
      });
      wrapper.update();

      await act(async () => {
        wrapper.find('.pf-c-table__toggle').first().find('button').simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(ActionModal)).toHaveLength(0);
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.requests.index);

      await act(async () => {
        wrapper.find('.pf-c-table__expandable-row').first().find('a').last().simulate('click', { button: 0 });
      });
      wrapper.update();

      expect(wrapper.find(ActionModal).props().actionType).toEqual('Deny');
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.requests.deny);
      expect(wrapper.find(MemoryRouter).instance().history.location.search).toEqual('?request=703');
    });
  });
});
