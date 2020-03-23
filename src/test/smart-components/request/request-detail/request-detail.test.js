import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import RequestDetail from '../../../../smart-components/request/request-detail/request-detail';
import { RequestLoader } from '../../../../presentational-components/shared/loader-placeholders';
import { APPROVAL_API_BASE } from '../../../../utilities/constants';
import RequestInfoBar from '../../../../smart-components/request/request-detail/request-info-bar';
import RequestTranscript from '../../../../smart-components/request/request-detail/request-transcript';
import { mockGraphql } from '../../../__mocks__/user-login';

const ComponentWrapper = ({ store, children, initialEntries = [ '/foo/123' ]}) => (
  <Provider store={ store } userRoles={ { name: 'Approval Administrator' } }>
    <MemoryRouter initialEntries={ initialEntries }>
      { children }
    </MemoryRouter>
  </Provider>
);

describe('<RequestDetail />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  beforeEach(() => {
    initialProps = {
      breadcrumbs: [{
        title: 'Foo'
      }]
    };
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: {
        isRequestDataLoading: true
      }
    };
  });

  it('should render request loader', async done => {
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123`, mockOnce({ body: {}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/actions`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/content`, mockOnce({ body: { params: { test: 'value' },
      product: 'Test product', order_id: '321', portfolio: 'TestPortfolio' }}));
    const store = mockStore(initialState);
    let wrapper;

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" render={ props => <RequestDetail { ...props } { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    expect(wrapper.find(RequestLoader)).toHaveLength(1);
    done();
  });

  it('should render request details', async done => {
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123`, mockOnce({ body: {}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/actions`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/content`, mockOnce({ body: { params: { test: 'value' },
      product: 'Test product', order_id: '321', portfolio: 'TestPortfolio' }}));
    const store = mockStore(
      initialState = {
        requestReducer: {
          selectedRequest: {
            actions: [{
              id: '266', created_at: '2019-12-20',
              request_id: '123', processed_by: 'system', operation: 'start'
            }],
            created_at: '2019-12-20',
            decision: 'undecided',
            group_name: 'Test Group',
            id: '123',
            name: 'Test Product',
            notified_at: '2019-12-20',
            number_of_children: 0,
            number_of_finished_children: 0,
            owner: 'test_owner',
            requester_name: 'A Name',
            state: 'notified',
            workflow_id: '123'
          },
          requestContent: {
            order_id: '363',
            params: {},
            portfolio: 'Portfolio',
            product: 'Product'
          },
          isRequestDataLoading: false
        }
      }
    );
    mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200, {
      data: {
        requests: [
          {
            actions: [],
            id: '124',
            name: 'Hello World',
            number_of_children: '0',
            decision: 'undecided',
            description: null,
            group_name: 'Catalog IQE approval',
            number_of_finished_children: '0',
            parent_id: '123',
            state: 'pending',
            workflow_id: '100'
          },

          {
            actions: [],
            id: '125',
            name: 'Hello World',
            number_of_children: '0',
            decision: 'undecided',
            description: null,
            group_name: 'Group1',
            number_of_finished_children: '0',
            parent_id: '123',
            state: 'pending',
            workflow_id: '200'
          },

          {
            actions: [
              {
                id: '1',
                operation: 'start',
                comments: null,
                created_at: '2020-01-29T17:08:56.850Z',
                processed_by: 'system'
              },
              {
                id: '2',
                operation: 'notify',
                comments: null,
                created_at: '2020-01-29T17:09:14.994Z',
                processed_by: 'system'
              }
            ],
            id: '126',
            name: 'Hello World',
            number_of_children: '0',
            decision: 'undecided',
            description: null,
            group_name: 'Group2',
            number_of_finished_children: '0',
            parent_id: '123',
            state: 'notified',
            workflow_id: '300'
          }
        ]
      }
    });

    let wrapper;
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" render={ props => <RequestDetail { ...props } { ...initialProps } isFetching={ false }/> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    expect(wrapper.find(RequestInfoBar)).toHaveLength(1);
    expect(wrapper.find(RequestTranscript)).toHaveLength(1);
    done();
  });
});
