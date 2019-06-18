import React from 'react';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import promiseMiddleware from 'redux-promise-middleware';

import Requests from '../../../smart-components/request/requests';
import { requestsInitialState } from '../../../redux/reducers/request-reducer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

describe('<Requests />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = { requestReducer: { ...requestsInitialState, isLoading: false }};
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Requests store={ store } { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly in loading state', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Requests store={ store } { ...initialProps } isLoading />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
