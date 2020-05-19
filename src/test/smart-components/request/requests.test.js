/* eslint-disable camelcase */
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import promiseMiddleware from 'redux-promise-middleware';
import { IntlProvider } from 'react-intl';
import Requests from '../../../smart-components/request/requests';
import requestReducer, { requestsInitialState } from '../../../redux/reducers/request-reducer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
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
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

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
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: { ...requestsInitialState, isLoading: false }
    };
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<ComponentWrapper store={ store }><Requests { ...initialProps } /></ComponentWrapper>);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly in loading state', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<ComponentWrapper store={ store }><Requests { ...initialProps } isLoading /></ComponentWrapper>);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should open row in the table and load its data', async () => {
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
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

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=created_at%3Adesc`, mockOnce({
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

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'name:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(3).simulate('click'); // name column
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=name%3Adesc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'name:desc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(3).simulate('click'); // name column
    });
    wrapper.update();

    apiClientMock.get(
      `${APPROVAL_API_BASE}/requests/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0&sort_by=requester_name%3Aasc`,
      mockOnce((req, res) => {
        expect(req.url().query).toEqual({
          'filter[name][contains_i]': '', limit: '50', offset: '0', sort_by: 'requester_name:asc'
        });
        return res.status(200).body({
          meta: { count: 1, limit: 50, offset: 0 },
          data: [ request ]
        });
      })
    );

    await act(async () => {
      wrapper.find('button').at(4).simulate('click'); // requester column
    });
    wrapper.update();
  });
});
