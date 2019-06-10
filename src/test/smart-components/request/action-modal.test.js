import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import { Button } from '@patternfly/react-core';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { APPROVAL_API_BASE } from '../../../utilities/constants';
import ActionModal from '../../../smart-components/request/action-modal';
import { requestsInitialState } from '../../../redux/reducers/request-reducer';
import { componentTypes } from '@data-driven-forms/react-form-renderer/dist/index';

describe('<ActionModal />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  const RequestWrapper = ({ store, children, initialEntries = []}) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      closeUrl: '/close',
      serviceData: {
        name: 'Foo',
        id: '1'
      }
    };
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: {
        ...requestsInitialState,
        isLoading: true,
        requestData: {
          name: 'Foo',
          id: '1'
        }
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<ActionModal { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should redirect back to close URL', (done) => {
    const store = mockStore(initialState);

    apiClientMock.get(`${APPROVAL_API_BASE}/requests/action-modal/1`, mockOnce(
      { body: {
        component: componentTypes.TEXTAREA_FIELD,
        name: 'comments',
        type: 'text',
        isRequired: false,
        label: 'Comment'
      }
      }));

    const wrapper = mount(
      <RequestWrapper store={ store } initialEntries={ [ '/foo/url' ] }>
        <Route to="/foo/url" render={ args => <ActionModal { ...initialProps } { ...args } /> }  />
      </RequestWrapper>
    );

    setImmediate(() => {
      wrapper.find(Button).first().simulate('click');
      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/close');
      done();
    });
  });
});

