import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { IntlProvider } from 'react-intl';

import RemoveWorkflowModal from '../../../smart-components/workflow/remove-workflow-modal';
import { Modal } from '@patternfly/react-core';
import { APPROVAL_API_BASE } from '../../../utilities/constants';

const ComponentWrapper = ({ store, children }) => (
  <Provider store={ store }>
    <MemoryRouter initialEntries={ [ '/back-route', '/foo/123' ] } initialIndex={ 1 }>
      <IntlProvider locale="en">
        { children }
      </IntlProvider>
    </MemoryRouter>
  </Provider>
);

describe('<RemoveWorkflowModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  beforeEach(() => {
    initialProps = {
      fetchData: jest.fn(),
      setSelectedWorkflows: jest.fn()
    };
    mockStore = configureStore(middlewares);
    initialState = {};
  });

  it('should not render workflow modal', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <RemoveWorkflowModal { ...initialProps } />
      </ComponentWrapper>
    );
    expect(wrapper.find(Modal)).toHaveLength(0);
  });

  it('should render workflow modal and call cancel callback', () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route to="/foo/:id" render={ props => <RemoveWorkflowModal { ...props } ids={ [ '123' ] } { ...initialProps } /> }/>
      </ComponentWrapper>
    );
    wrapper.update();
    expect(wrapper.find(Modal)).toHaveLength(1);

    wrapper.find('button#cancel-remove-workflow').simulate('click');
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/back-route');
  });

  it('should remove single workflow and redirect', async done => {
    expect.assertions(2);
    const store = mockStore(initialState);
    apiClientMock.delete(`${APPROVAL_API_BASE}/workflows/123`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200);
    }));

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route to="/foo/:id" render={ props => <RemoveWorkflowModal { ...props } ids={ [ '123' ] } { ...initialProps } /> }/>
      </ComponentWrapper>
    );
    wrapper.update();

    await act(async() => {
      wrapper.find('button#submit-remove-workflow').simulate('click');
    });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows');

    done();
  });

  it('should remove multiple workflows and redirect', async done => {
    expect.assertions(3);
    const store = mockStore(initialState);
    apiClientMock.delete(`${APPROVAL_API_BASE}/workflows/123`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200);
    }));
    apiClientMock.delete(`${APPROVAL_API_BASE}/workflows/456`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      return res.status(200);
    }));

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route to="/foo/:id" render={ props => <RemoveWorkflowModal { ...props } ids={ [ '123', '456' ] } { ...initialProps } /> }/>
      </ComponentWrapper>
    );
    wrapper.update();

    await act(async() => {
      wrapper.find('button#submit-remove-workflow').simulate('click');
    });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows');

    done();
  });
});
