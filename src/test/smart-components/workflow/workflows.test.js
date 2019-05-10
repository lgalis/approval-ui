import React from 'react';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import promiseMiddleware from 'redux-promise-middleware';

import Workflows from '../../../smart-components/workflow/workflows';
import { workflowsInitialState } from '../../../redux/reducers/workflow-reducer';
import { notificationsMiddleware } from '@red-hat-insights/insights-frontend-components/components/Notifications';

describe('<Workflows />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = { workflowReducer: { ...workflowsInitialState, isLoading: false }};
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('should render correctly', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Workflows store={ store } { ...initialProps } />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly in loading state', () => {
    const store = mockStore(initialState);
    const wrapper = shallow(<Workflows store={ store } { ...initialProps } isLoading />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
