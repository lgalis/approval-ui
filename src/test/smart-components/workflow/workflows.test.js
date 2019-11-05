import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { shallowToJson } from 'enzyme-to-json';
import promiseMiddleware from 'redux-promise-middleware';
import { IntlProvider } from 'react-intl';

import Workflows from '../../../smart-components/workflow/workflows';
import { workflowsInitialState } from '../../../redux/reducers/workflow-reducer';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { groupsInitialState } from '../../../redux/reducers/group-reducer';
import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import EditWorkflowInfoModal from '../../../smart-components/workflow/edit-workflow-info-modal';
import EditWorkflowStagesModal from '../../../smart-components/workflow/edit-workflow-stages-modal';
import RemoveWorkflowModal from '../../../smart-components/workflow/remove-workflow-modal';
import AddStagesWizard from '../../../smart-components/workflow/add-stages/add-stages-wizard';

const ComponentWrapper = ({ store, initialEntries = [ '/workflows' ], children }) => (
  <Provider store={ store }>
    <MemoryRouter initialEntries={ initialEntries }>
      <IntlProvider locale="en">
        { children }
      </IntlProvider>
    </MemoryRouter>
  </Provider>
);

describe('<Workflows />', () => {

  let initialProps;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let initialState;
  let stateWithData;

  beforeEach(() => {
    initialProps = {
      history: {
        goBack: jest.fn(),
        push: jest.fn()
      }
    };
    mockStore = configureStore(middlewares);
    initialState = { workflowReducer: { ...workflowsInitialState, isLoading: false }, groupReducer: { ...groupsInitialState }};
    stateWithData = {
      groupReducer: { ...groupsInitialState },
      workflowReducer: {
        ...workflowsInitialState,
        data: [{
          id: '123',
          name: 'foo'
        }]
      }
    };
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

  it('should redirect to Edit info page', async done => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows?limit=10&offset=0`, mockOnce({ body: { data: [{
      id: 'edit-id',
      name: 'foo',
      group_refs: [ 'group-1' ],
      group_names: [ 'group-name-1' ]
    }]}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/group-1/`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/edit-id`, mockOnce({ body: { data: []}}));
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows" component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on edit action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('a.pf-c-dropdown__menu-item').first().simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows/edit-info/edit-id');
    expect(wrapper.find(EditWorkflowInfoModal)).toHaveLength(1);
    done();
  });

  it('should redirect to Edit workflow stages page', async done => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows?limit=10&offset=0`, mockOnce({ body: { data: [{
      id: 'edit-id',
      name: 'foo',
      group_refs: [ 'group-1' ],
      group_names: [ 'group-name-1' ]
    }]}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/group-1/`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/edit-id`, mockOnce({ body: { group_refs: []}}));
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows" component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on edit stages action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('a.pf-c-dropdown__menu-item').at(1).simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows/edit-stages/edit-id');
    expect(wrapper.find(EditWorkflowStagesModal)).toHaveLength(1);
    done();
  });

  it('should redirect to Delete workflow page', async done => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows?limit=10&offset=0`, mockOnce({ body: { data: [{
      id: 'edit-id',
      name: 'foo',
      group_refs: [ 'group-1' ],
      group_names: [ 'group-name-1' ]
    }]}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/group-1/`, mockOnce({ body: { data: []}}));
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows" component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Open action drop down and click on delete action
     */
    wrapper.find('button.pf-c-dropdown__toggle.pf-m-plain').last().simulate('click');
    await act(async() => {
      wrapper.find('a.pf-c-dropdown__menu-item').at(2).simulate('click');
    });

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows/remove/edit-id');
    expect(wrapper.find(RemoveWorkflowModal)).toHaveLength(1);
    done();
  });

  it('should redirect to add workflow page', async done => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows?limit=10&offset=0`, mockOnce({ body: { data: [{
      id: 'edit-id',
      name: 'foo',
      group_refs: [ 'group-1' ],
      group_names: [ 'group-name-1' ]
    }]}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/group-1/`, mockOnce({ body: { data: []}}));
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows" component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    /**
     * Click on add workflow link
     */
    wrapper.find('Link#add-workflow-link').simulate('click', { button: 0 });

    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows/add-workflow');
    expect(wrapper.find(AddStagesWizard)).toHaveLength(1);
    done();
  });

  it('should remove multiple selected workflows from table', async done => {
    const store = mockStore(stateWithData);
    let wrapper;

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows?limit=10&offset=0`, mockOnce({ body: { data: [{
      id: 'edit-id',
      name: 'foo',
      group_refs: [ 'group-1' ],
      group_names: [ 'group-name-1' ]
    }]}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/`, mockOnce({ body: { data: []}}));
    apiClientMock.get(`${RBAC_API_BASE}/groups/group-1/`, mockOnce({ body: { data: []}}));
    await act(async()=> {
      wrapper = mount(
        <ComponentWrapper store={ store }>
          <Route path="/workflows" component={ Workflows } />
        </ComponentWrapper>
      );
    });
    wrapper.update();
    wrapper.find('input[type="checkbox"]').last().simulate('change', { target: { checked: true }});
    wrapper.find('Link#remove-multiple-workflows').simulate('click', { button: 0 });
    wrapper.update();
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/workflows/remove');
    expect(wrapper.find(RemoveWorkflowModal)).toHaveLength(1);
    done();
  });
});
