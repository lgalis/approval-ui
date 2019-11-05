import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ActionModal from '../../../smart-components/request/action-modal';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import { FETCH_REQUEST } from '../../../redux/action-types';

const ComponentWrapper = ({ store, children }) => (
  <Provider store={ store }>
    <MemoryRouter initialEntries={ [ '/foo/123' ] }>
      { children }
    </MemoryRouter>
  </Provider>
);

describe('<ActionModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  beforeEach(() => {
    initialProps = {
      postMethod: jest.fn()
    };
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: { isRequestDataLoading: true }
    };
  });

  afterEach(() => {
    initialProps.postMethod.mockReset();
  });

  it('should render action modal and post submit data', async done => {
    const store = mockStore(initialState);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123`, mockOnce({ body: {
      active_stage: 1
    }}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/stages`, mockOnce({ body: { data: [{
      id: 'active-stage',
      stages: [{ foo: 'bar' }],
      active_stage: 1
    }]}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/stages/active-stage/actions`, mockOnce({ body: {
      id: 'active-stage',
      stages: [{ foo: 'bar' }],
      active_stage: 1
    }}));

    apiClientMock.post(`${APPROVAL_API_BASE}/stages/active-stage/actions`, mockOnce((req, response) => {
      expect(JSON.parse(req.body())).toEqual({ comments: 'foo' });
      return response.status(200);
    }));
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" component={ props => <ActionModal { ...props } { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const textarea = wrapper.find('textarea#comments');
    textarea.getDOMNode().value = 'foo';
    textarea.simulate('change');
    wrapper.update();

    await act(async() => {
      wrapper.find('button').last().simulate('click');
    });
    wrapper.update();

    expect(initialProps.postMethod).toHaveBeenCalled();
    done();
  });

  it('should render action modal and create notification for missing stage', async done => {
    const store = mockStore(initialState);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123`, mockOnce({ body: {}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/stages`, mockOnce({ body: { data: [{
      id: 'active-stage',
      stages: [],
      active_stage: 1
    }]}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/stages/active-stage/actions`, mockOnce({ body: {
      id: 'active-stage',
      stages: [],
      active_stage: 1
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" component={ props => <ActionModal { ...props } { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const textarea = wrapper.find('textarea#comments');
    textarea.getDOMNode().value = 'foo';
    textarea.simulate('change');
    wrapper.update();

    await act(async() => {
      wrapper.find('button').last().simulate('click');
    });
    wrapper.update();

    const expectedActions = [
      { type: `${FETCH_REQUEST}_PENDING` },
      { type: `${FETCH_REQUEST}_FULFILLED`, payload: { stages: expect.any(Array) }},
      {
        type: '@@INSIGHTS-CORE/NOTIFICATIONS/ADD_NOTIFICATION',
        payload: {
          variant: 'warning',
          title: 'undefined Request',
          dismissable: true,
          description: 'undefined Request - no active stage.'
        }
      }
    ];
    expect(store.getActions()).toEqual(expectedActions);
    done();
  });

  it('should call cancel callback', async done => {
    const store = mockStore(initialState);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123`, mockOnce({ body: {}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/stages`, mockOnce({ body: { data: [{
      id: 'active-stage',
      stages: [],
      active_stage: 1
    }]}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/stages/active-stage/actions`, mockOnce({ body: {
      id: 'active-stage',
      stages: [],
      active_stage: 1
    }}));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" component={ props => <ActionModal { ...props } { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    wrapper.find('button.pf-c-button.pf-m-secondary').simulate('click');
    wrapper.update();

    const expectedActions = [
      { type: `${FETCH_REQUEST}_PENDING` },
      { type: `${FETCH_REQUEST}_FULFILLED`, payload: { stages: expect.any(Array) }},
      {
        type: '@@INSIGHTS-CORE/NOTIFICATIONS/ADD_NOTIFICATION',
        payload: {
          variant: 'warning',
          title: 'undefined Request',
          dismissable: true,
          description: 'undefined Request was cancelled by the user.'
        }
      }
    ];
    expect(store.getActions()).toEqual(expectedActions);
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/requests');
    done();
  });
});
