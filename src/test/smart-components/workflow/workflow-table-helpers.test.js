
import React from 'react';
import { createRows, GroupsLabels, MoveButtons, SelectBox } from '../../../smart-components/workflow/workflow-table-helpers';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { act } from 'react-dom/test-utils';

import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store' ;
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import { Button } from '@patternfly/react-core';
import { AngleDownIcon, AngleUpIcon } from '@patternfly/react-icons';
import * as asyncDebounce from '../../../utilities/async-debounce';
import * as actions from '../../../redux/actions/workflow-actions';
import * as helpers from '../../../helpers/workflow/workflow-helper';
import WorkflowTableContext from '../../../smart-components/workflow/workflow-table-context';

describe('approval process table helpers', () => {
  it('should create rows correctly', () => {
    const data = [{
      id: '1',
      name: 'foo',
      description: 'bar',
      sequence: 2,
      group_refs: [{ name: 'group_refs', uuid: 'group_uuid' }]
    }, {
      name: 'should be in result',
      id: '2',
      description: 'baz',
      sequence: 1,
      group_refs: [{ name: 'group_refs', uuid: 'group_uuid' }]
    }];

    const expectedData = [{
      id: '1',
      cells: [
        <React.Fragment key='1-buttons'>
          <MoveButtons id="1" sequence={ 2 } />
        </React.Fragment>,
        <React.Fragment key='1-checkbox'>
          <SelectBox id="1" />
        </React.Fragment>,
        'foo',
        'bar',
        <React.Fragment key="1"><GroupsLabels key="1" group_refs={ [{ name: 'group_refs', uuid: 'group_uuid' }] } id="1" /></React.Fragment>
      ]
    }, {
      id: '2',
      cells: [
        <React.Fragment key='2-buttons'>
          <MoveButtons id="2" sequence={ 1 } />
        </React.Fragment>,
        <React.Fragment key='2-checkbox'>
          <SelectBox id="2" />
        </React.Fragment>,
        'should be in result',
        'baz',
        <React.Fragment key="2"><GroupsLabels key="2" group_refs={ [{ name: 'group_refs', uuid: 'group_uuid' }] } id="2"/></React.Fragment>
      ]
    }];
    expect(JSON.stringify(createRows(data, 'result'))).toEqual(JSON.stringify(expectedData));
  });

  describe('<MoveButtons />', () => {
    let wrapper;
    let initialProps;
    let store;
    let mockStore;

    const middlewares = [ thunk, promiseMiddleware ];
    const id = '425';

    const mountComponent = (props, store) => mount(
      <IntlProvider locale="en">
        <Provider store={ store } >
          <WorkflowTableContext.Provider value={ { cache: []} }>
            <MoveButtons { ...props }/>
          </WorkflowTableContext.Provider>
        </Provider>
      </IntlProvider>
    );

    beforeEach(() => {
      initialProps = {
        id,
        sequence: 11
      };

      mockStore = configureStore(middlewares);

      store = mockStore({
        workflowReducer: {}
      });

      asyncDebounce.default = jest.fn().mockImplementation((fn) => fn);
      helpers.updateWorkflow = jest.fn().mockImplementation(() => Promise.resolve({ wf: 'ok' }));
      helpers.repositionWorkflow = jest.fn().mockImplementation(() => Promise.resolve({ wf: 'ok' }));
      actions.fetchWorkflows = jest.fn().mockImplementation(() => ({ type: 'fetch' }));
    });

    it('renders correctly', () => {
      wrapper = mountComponent(initialProps, store);

      expect(wrapper.find(Button)).toHaveLength(2);
      expect(wrapper.find(Button).first().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(Button).last().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(AngleUpIcon)).toHaveLength(1);
      expect(wrapper.find(AngleDownIcon)).toHaveLength(1);
    });

    it('disabled on loading', () => {
      store = mockStore({
        workflowReducer: {
          isLoading: true
        }
      });

      wrapper = mountComponent(initialProps, store);

      expect(wrapper.find(Button)).toHaveLength(2);
      expect(wrapper.find(Button).first().props().isDisabled).toEqual(true);
      expect(wrapper.find(Button).last().props().isDisabled).toEqual(true);
      expect(wrapper.find(AngleUpIcon)).toHaveLength(1);
      expect(wrapper.find(AngleDownIcon)).toHaveLength(1);
    });

    it('disabled on updating', () => {
      store = mockStore({
        workflowReducer: {
          isLoading: false,
          isUpdating: 1
        }
      });

      wrapper = mountComponent(initialProps, store);

      expect(wrapper.find(Button)).toHaveLength(2);
      expect(wrapper.find(Button).first().props().isDisabled).toEqual(true);
      expect(wrapper.find(Button).last().props().isDisabled).toEqual(true);
      expect(wrapper.find(AngleUpIcon)).toHaveLength(1);
      expect(wrapper.find(AngleDownIcon)).toHaveLength(1);
    });

    it('moves up - asc', async () => {
      wrapper = mountComponent(initialProps, store);

      await act(async () => {
        wrapper.find(Button).first().simulate('click');
      });
      wrapper.update();

      expect(helpers.repositionWorkflow).toHaveBeenCalledWith(
        {
          id,
          sequence: { increment: -1 }
        }
      );
      expect(actions.fetchWorkflows).toHaveBeenCalled();
    });

    it('moves down - asc', async () => {
      wrapper = mountComponent(initialProps, store);

      await act(async () => {
        wrapper.find(Button).last().simulate('click');
      });
      wrapper.update();

      expect(helpers.repositionWorkflow).toHaveBeenCalledWith({
        id,
        sequence: { increment: 1 }
      });
      expect(actions.fetchWorkflows).toHaveBeenCalled();
    });
  });
});
