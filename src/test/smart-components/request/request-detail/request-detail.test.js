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

const ComponentWrapper = ({ store, children, initialEntries = [ '/foo/123' ]}) => (
  <Provider store={ store }>
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
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/stages`, mockOnce({ body: { data: []}}));
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
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123`, mockOnce({ body: {
      content: { params: {
        foo: 'bar'
      }}
    }}));
    apiClientMock.get(`${APPROVAL_API_BASE}/requests/123/stages`, mockOnce({ body: { data: []}}));
    const store = mockStore(
      initialState = {
        requestReducer: {
          isRequestDataLoading: false
        }
      }
    );
    let wrapper;

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/foo/:id" render={ props => <RequestDetail { ...props } { ...initialProps } /> } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    expect(wrapper.find(RequestInfoBar)).toHaveLength(1);
    expect(wrapper.find(RequestTranscript)).toHaveLength(1);
    done();
  });
});
