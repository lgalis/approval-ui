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

const ComponentWrapper = ({ store, initialEntries = [ '/requests' ], children }) => (
  <Provider store={ store } value={ { roles: []} }>
    <MemoryRouter initialEntries={ initialEntries }>
      <IntlProvider locale="en">
        { children }
      </IntlProvider>
    </MemoryRouter>
  </Provider>
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
    expect.assertions(5);

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
