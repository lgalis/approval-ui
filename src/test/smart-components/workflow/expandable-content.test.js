import { Text } from '@patternfly/react-core';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/cjs/Skeleton';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import ExpandableContent from '../../../smart-components/workflow/expandable-content';

describe('ExpandableContent', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let store;
  let initialProps;
  let id;
  let groupName1;
  let groupName2;

  const ComponentWrapper = ({ store, children }) => (
    <IntlProvider locale="en">
      <Provider store={ store }>
        <MemoryRouter initialEntries={ [ '' ] }>
          { children }
        </MemoryRouter>
      </Provider>
    </IntlProvider>
  );

  beforeEach(() => {
    id = '656646842';
    mockStore = configureStore(middlewares);
    store = mockStore(() => ({ workflowReducer: { expandedWorkflows: [ id ]}}));
    initialProps = { description: 'this is a description',
      groupRefs: [{ name: 'GroupName1', uuid: '54654' }, { name: 'GroupName2', uuid: '656564655' }], id  };
    groupName1 = 'GroupName1';
    groupName2 = 'GroupName2';
  });

  it('calls API fetch when expandedRequests is changed only one time', async () => {
    let wrapper;

    await act(async() => {
      wrapper = mount(<ComponentWrapper store={ store }><ExpandableContent { ...initialProps }/></ComponentWrapper>);
    });

    wrapper.update();
    expect(wrapper.find(Skeleton)).toHaveLength(0);

    expect(wrapper.find(Text)).toHaveLength(4);
    expect(wrapper.find(Text).last().text().includes(groupName1)).toEqual(true);
    expect(wrapper.find(Text).last().text().includes(groupName2)).toEqual(true);
  });
});
