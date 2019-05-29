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

import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../../utilities/constants';
import FormRenderer from '../../../smart-components/common/form-renderer';
import AddWorkflowModal from '../../../smart-components/workflow/add-workflow-modal';
import { validatorTypes } from '@data-driven-forms/react-form-renderer/dist/index';

describe('<AddWorkflowModal />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  const ComponentWrapper = ({ store, children, workflowId }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ [ `workflows/edit/${workflowId}` ] }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    initialProps = {

    };
    initialState = {
      groupReducer: {
        rbacGroups: [{
          label: 'foo',
          value: 'bar'
        }]
      },
      workflowReducer: {
        workflows: [{
          id: '123',
          name: 'Workflow'
        }]
      }
    };
    mockStore = configureStore(middlewares);
  });

  it('should render correctly', () => {
    const store = mockStore({});
    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({ body: { data: []}}));
    const wrapper = shallow(<ComponentWrapper store={ store }><AddWorkflowModal { ...initialProps } /></ComponentWrapper>).dive();

    setImmediate(() => {
      expect(shallowToJson(wrapper)).toMatchSnapshot();
    });
  });

  it('should create edit variant of workflow modal', done => {
    const store = mockStore(initialState);

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows`, mockOnce({
      body: {
        data: [{
          name: 'workflow',
          id: '123'
        }]
      }
    }));

    apiClientMock.get(`${RBAC_API_BASE}/groups/stage1/`, mockOnce({
      body: {
        name: 'Group1',
        id: 'stage1'
      }
    }));

    apiClientMock.get(`${RBAC_API_BASE}/groups/stage2/`, mockOnce({
      body: {
        name: 'Group2',
        id: 'stage2'
      }
    }));

    apiClientMock.get(`${APPROVAL_API_BASE}/workflows/123`, mockOnce({
      body: {
        name: 'workflow',
        id: '123',
        group_refs: [ 'stage1', 'stage2' ]
      }
    }));

    const expectedSchema = {
      fields: [{
        component: componentTypes.WIZARD,
        name: 'workflow_wizard',
        fields: [{
          title: 'Workflow information',
          name: 'wf_step_info',
          stepKey: 1,
          nextStep: 'wf_step_stages',
          fields: [{
            component: componentTypes.TEXTAREA_FIELD,
            name: 'name',
            type: 'text',
            isRequired: true,
            label: 'Name',
            validate: [{
              type: validatorTypes.REQUIRED
            }]
          }, {
            component: componentTypes.TEXTAREA_FIELD,
            name: 'description',
            type: 'text',
            label: 'Description'
          }]
        }, {
          stepKey: 'wf_step_stages',
          title: 'Set Approval Stages',
          name: 'wf_step_stages',
          nextStep: 'summary',
          component: componentTypes.FORM_GROUP,
          fields: [{
            name: 'wfGroups',
            component: componentTypes.FIELD_ARRAY,
            fields: [{
              component: componentTypes.SELECT,
              name: 'stage',
              isRequired: false,
              label: 'Stage',
              options: [{
                label: 'None',
                value: undefined
              }]
            }]
          }]
        }, {
          fields: [{
            name: 'summary',
            component: 'summary'
          }],
          stepKey: 'summary',
          name: 'summary'
        }]
      }]
    };

    const wrapper = mount(
      <ComponentWrapper store={ store } workflowId="123">
        <Route path="workflows/edit/:id?" render={ () => <AddWorkflowModal { ...initialProps } match={ { params: { id: '123' }} } /> }/>
      </ComponentWrapper>
    );

    setImmediate(() => {
      const modal = wrapper.find(Modal);
      const form = wrapper.find(FormRenderer);
      expect(modal.props().title).toEqual('Edit workflow');
      expect(form.props().schema).toEqual(expectedSchema);
      done();
    });
  });

  it('should create edit variant of workflow modal and call updateWorkflow on submit', () => {
    const store = mockStore(initialState);

    apiClientMock.patch(`${APPROVAL_API_BASE}/workflows/123`, ((req, res) => {
      expect(JSON.parse(req.body())).toEqual({ id: '123', name: 'Workflow' });
      return res.body(200);
    }));

    const wrapper = mount(
      <ComponentWrapper store={ store } workflowId="123">
        <Route
          path="workflows/edit/:id?"
          render={ () => <AddWorkflowModal { ...initialProps } match={ { params: { id: '123' }} }/> }
        />
      </ComponentWrapper>
    );

    const button = wrapper.find('button').last();
    button.simulate('click');
  });
});
