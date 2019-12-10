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
import { requestsInitialState } from '../../../redux/reducers/request-reducer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

const ComponentWrapper = ({ store, initialEntries = [ '/requests' ], children }) => (
  <Provider store={ store }>
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

  beforeEach(() => {
    initialProps = {};
    mockStore = configureStore(middlewares);
    initialState = { requestReducer: { ...requestsInitialState, isLoading: false }};
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
});
