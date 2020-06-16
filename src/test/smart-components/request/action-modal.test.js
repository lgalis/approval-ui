import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import ActionModal from '../../../smart-components/request/action-modal';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import routes from '../../../constants/routes';

const ComponentWrapper = ({ store, children }) => (
  <Provider store={ store }>
    <MemoryRouter initialEntries={ [{ pathname: routes.request.index, search: '?request=123' }] }>
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
    apiClientMock.reset();
    initialProps = {
      postMethod: jest.fn(),
      actionType: 'Add Comment'
    };
    mockStore = configureStore(middlewares);
    initialState = {
      requestReducer: { isRequestDataLoading: true }
    };
  });

  afterEach(() => {
    initialProps.postMethod.mockReset();
  });

  it('should render action modal and post submit data', async () => {
    expect.assertions(3);
    const store = mockStore(initialState);
    let wrapper;

    apiClientMock.post(`${APPROVAL_API_BASE}/requests/123/actions`, mockOnce((req, response) => {
      expect(JSON.parse(req.body())).toEqual({ operation: 'memo', comments: 'foo' });
      return response.status(200);
    }));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <ActionModal { ...initialProps } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const textarea = wrapper.find('textarea#comments');
    textarea.getDOMNode().value = 'foo';
    textarea.simulate('change');
    wrapper.update();

    expect(initialProps.postMethod).not.toHaveBeenCalled();

    await act(async() => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();

    expect(initialProps.postMethod).toHaveBeenCalled();
  });

  it('should render action modal and post submit data without post method', async () => {
    expect.assertions(1);
    const store = mockStore(initialState);
    let wrapper;

    apiClientMock.post(`${APPROVAL_API_BASE}/requests/123/actions`, mockOnce((req, response) => {
      expect(JSON.parse(req.body())).toEqual({ operation: 'memo', comments: 'foo' });
      return response.status(200);
    }));

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <ActionModal { ...initialProps } postMethod={ undefined }/>
        </ComponentWrapper>
      );
    });
    wrapper.update();

    const textarea = wrapper.find('textarea#comments');
    textarea.getDOMNode().value = 'foo';
    textarea.simulate('change');
    wrapper.update();

    await act(async() => {
      wrapper.find('form').simulate('submit');
    });
    wrapper.update();
  });

  it('should call cancel callback', async () => {
    const store = mockStore(initialState);
    let wrapper;

    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <ActionModal { ...initialProps } />
        </ComponentWrapper>
      );
    });
    wrapper.update();

    wrapper.find('button.pf-c-button').first().simulate('click');
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/requests');
  });
});
