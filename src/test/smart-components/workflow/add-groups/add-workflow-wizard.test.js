import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store' ;
import { act } from 'react-dom/test-utils';

import { MemoryRouter, Route } from 'react-router-dom';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/';
import AddWorkflow from '../../../../smart-components/workflow/add-groups/add-workflow-wizard';
import { IntlProvider } from 'react-intl';
import { APPROVAL_API_BASE } from '../../../../utilities/constants';

describe('<AddWorkflow />', () => {
  let initialProps;
  let initialState;
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;

  const ComponentWrapper = ({ store, children }) => (
    <IntlProvider locale="en">
      <Provider store={ store }>
        <MemoryRouter initialEntries={ [ '/workflows/', '/workflows/add-workflow/', '/workflows/' ] } initialIndex={ 1 }>
          { children }
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    initialProps = {
      id: '123',
      postMethod: jest.fn(),
      handleChange: jest.fn()
    };

    initialState = {
      groupReducer: {
        groups: [{
          label: 'foo',
          value: 'bar'
        }]
      },
      workflowReducer: {
        workflows: { data: { id: 1, group_refs: [{
          uuid: '123',
          name: 'SampleWorkflow'
        }]}
        }}
    };
    mockStore = configureStore(middlewares);
  });

  it.skip('should submit the form', async () => {
    // skipped because FF throws error
    // TypeError: Cannot read property 'active' of undefined
    // at data (node_modules/node_modules/final-form/dist/final-form.es.js:184:7)

    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=&limit=50&offset=0`,
      mockOnce({
        body: {
          data: []
        }
      })
    );
    apiClientMock.get(
      `${APPROVAL_API_BASE}/workflows/?filter%5Bname%5D%5Bcontains_i%5D=some-name-form&limit=50&offset=0`,
      mockOnce({
        body: {
          data: []
        }
      })
    );
    jest.useFakeTimers();

    const store = mockStore(initialState);

    const wrapper = mount(
      <ComponentWrapper store={ store }>
        <Route path="/workflows/add-workflow/" render={ () => <AddWorkflow { ...initialProps } /> } />
      </ComponentWrapper>
    );

    await act(async () => {
      jest.advanceTimersByTime(500); // initial async validation
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('input').first().simulate('change', { target: { value: 'some-name' }});
    });
    wrapper.update();

    await act(async () => {
      jest.advanceTimersByTime(500); // name async validaton
    });
    wrapper.update();

    jest.useRealTimers();
  });
});
