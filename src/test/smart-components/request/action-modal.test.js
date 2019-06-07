import React from 'react';
import thunk from 'redux-thunk';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store' ;
import { Modal } from '@patternfly/react-core';
import { shallowToJson } from 'enzyme-to-json';
import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';

import { APPROVAL_API_BASE } from '../../../utilities/constants';
import FormRenderer from '../../../smart-components/common/form-renderer';
import ActionModal from '../../../smart-components/request/action-modal';

describe('<ActionModal />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  const ComponentWrapper = ({ store, children, requestId }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ [ `requests/${requestId}` ] }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {

    };
    initialState = {
      approvalReducer: {
        workflows: [{
          label: 'foo',
          value: 'bar'
        }]
      },
      requestReducer: {
        requests: [{
          id: '123',
          name: 'Request'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore({});
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: { data: []}}));
    const wrapper = shallow(<ComponentWrapper store={ store }><ActionModal { ...initialProps } /></ComponentWrapper>).dive();

    setImmediate(() => {
      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should create the AddComment variant of the action modal', done => {
    const store = mockStore(initialState);

    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({
      body: {
        data: [{
          id: '123'
        }]
      }
    }));

    const expectedSchema = {
      fields: [{
        component: componentTypes.TEXT_FIELD,
        isRequired: true,
        label: 'Comment',
        name: 'name',
        validate: [ expect.any(Function) ]
      }]
    };

    const wrapper = mount(
      <ComponentWrapper store={ store } requestId="123">
        <Route path="requests/add_comment/:id?" render={ () => <ActionModal { ...initialProps } match={ { params: { id: '123' }} } /> }/>
      </ComponentWrapper>
    );

    setImmediate(() => {
      const modal = wrapper.find(Modal);
      const form = wrapper.find(FormRenderer);
      expect(modal.props().title).toEqual('Add Comment');
      expect(form.props().schema).toEqual(expectedSchema);
      done();
    });
  });

  it('should create Add comment variant of the action modal and call updateRequest on submit', () => {
    const store = mockStore(initialState);

    apiClientMock.patch(`${APPROVAL_API_BASE}/requests/add_comment/123`, ((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ id: '123', name: 'Request', comment: 'Test' });
      return res.body(200);
    }));

    apiClientMock.get(`${APPROVAL_API_BASE}/requests`, mockOnce({ body: {
      data: [{
        label: 'foo',
        value: 'bar'
      }]
    }}));

    const wrapper = mount(
      <ComponentWrapper store={ store } requestId="123">
        <Route
          path="requests/add_comment/:id?"
          render={ () => <ActionModal { ...initialProps } match={ { params: { id: '123' }} }/> }
        />
      </ComponentWrapper>
    );

    const button = wrapper.find('button').last();
    button.simulate('click');
  });
});
