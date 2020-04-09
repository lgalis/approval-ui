import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import SetStages from '../../../../smart-components/workflow/add-stages/set-groups';
import { TrashIcon } from '@patternfly/react-icons';
import AsyncSelect from 'react-select/async';
import { RBAC_API_BASE } from '../../../../utilities/constants';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store' ;
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';

describe('<SetStages />', () => {
  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, initialEntries, children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ initialEntries } keyLength={ 0 }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {
      formData: {
        wfGroups: []
      },
      handleChange: jest.fn(),
      defaultOptions: [],
      title: 'Set stages test'
    };
    mockStore = configureStore(middlewares);
  });

  it('should call remove stage callback', async () => {
    const store = mockStore({ groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    let wrapper;
    const handleChange = jest.fn();
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store } >
          <SetStages
            { ...initialProps }
            formData={ { wfGroups: [{ id: 'should be in callback' }, { id: 'should not be in callback' }]} }
            handleChange={ handleChange }
          />
        </ComponentWrapper>);
    });
    wrapper.update();

    wrapper.find('button.pf-c-button.pf-m-link').first().simulate('click');
    expect(handleChange).toHaveBeenCalledWith({ wfGroups: [{ id: 'should be in callback' }]});
  });

  it('should call add stage callback', async () => {
    const store = mockStore({ groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    let wrapper;
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store } >
          <SetStages
            { ...initialProps }
            formData={ { wfGroups: []} }
          /></ComponentWrapper>);
    });
    wrapper.update();

    expect(wrapper.find(TrashIcon)).toHaveLength(0);
    /**
     * Need to add two stages, first can not bet deleted
     */
    wrapper.find('button.pf-c-button.pf-m-link').first().simulate('click');
    wrapper.find('button.pf-c-button.pf-m-link').first().simulate('click');
    wrapper.update();
    expect(wrapper.find(TrashIcon)).toHaveLength(1);
  });

  it('should call onInputChange callback', async (done) => {
    const store = mockStore({ groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});
    let wrapper;
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store } >
          <SetStages
            { ...initialProps }
            formData={ { wfGroups: [{}]} }
          /></ComponentWrapper>);
    });
    wrapper.update();
    const selectInput = wrapper.find('input');
    selectInput.getDOMNode().value = 'foo';
    selectInput.simulate('change');
    wrapper.update();
    expect(wrapper.find(AsyncSelect).props().inpuValue).toEqual('foo');
    done();
  });

  it('should call loadOptions request for async select', async (done) => {
    expect.assertions(1);
    const store = mockStore({ groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});

    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22%0A%20%20&name=foo`,
      mockOnce((req, res) => {
        expect(req).toBeTruthy();
        done();
        return res.status(200);
      }));
    let wrapper;
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store } >
          <SetStages
            { ...initialProps }
            formData={ { wfGroups: [{}]} }
          /></ComponentWrapper>);
    });
    wrapper.update();

    const selectInput = wrapper.find('input');
    selectInput.getDOMNode().value = 'foo';
    selectInput.simulate('change');
    wrapper.update();
    setTimeout(() => {
      wrapper.update();
    }, 251);
  });

  it('should call handleChange prop', async (done) => {
    const store = mockStore({ groupReducer: { groups: [{  value: '123', label: 'Group 1' }]}});

    let wrapper;
    const handleChange = jest.fn();
    apiClientMock.get(`${RBAC_API_BASE}/groups/?role_names=%22%2CApproval%20Administrator%2CApproval%20Approver%2C%22`,
      mockOnce({ body: { data: []}}));
    await act(async() => {
      wrapper = mount(
        <ComponentWrapper store={ store } >
          <SetStages
            { ...initialProps }
            formData={ { wfGroups: [{}]} }
            options={ [{ label: 'foo', value: '1' }] }
            handleChange={ handleChange }
          /></ComponentWrapper>);
    });
    wrapper.update();

    wrapper.find(AsyncSelect).props().onChange({ value: '1', label: 'foo' });
    expect(handleChange).toHaveBeenCalledWith({ wfGroups: [{ label: 'foo', value: '1' }]});
    done();
  });
});
