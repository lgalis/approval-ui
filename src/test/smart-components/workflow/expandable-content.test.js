import { Text } from '@patternfly/react-core';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import ExpandableContent from '../../../smart-components/workflow/expandable-content';
import * as helpers from '../../../helpers/group/group-helper';

describe('ExpandableContent', () => {
  const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
  let mockStore;
  let store;
  let initialProps;
  let id;
  let groupName1;
  let groupName2;

  const ComponentWrapper = ({ store, children }) => (
    <Provider store={ store }>
      <MemoryRouter initialEntries={ [ '' ] }>
        { children }
      </MemoryRouter>
    </Provider>
  );

  beforeEach(() => {
    id = '656646842';
    mockStore = configureStore(middlewares);
    store = mockStore(() => ({ workflowReducer: { expandedWorkflows: [ id ]}}));
    initialProps = { description: 'this is a description', groupRefs: [ '54654', '656564655' ], id  };

    groupName1 = 'GroupName1';
    groupName2 = 'GroupName12';

    helpers.fetchGroupName = jest.fn()
    .mockImplementationOnce(() => Promise.resolve(groupName1))
    .mockImplementationOnce(() => Promise.resolve(groupName2));
  });

  it('renders correctly when loading', async () => {
    let wrapper;

    await act(async() => {
      wrapper = mount(<ComponentWrapper store={ store }><ExpandableContent { ...initialProps }/></ComponentWrapper>);
    });

    expect(wrapper.find(Text)).toHaveLength(3);
    expect(wrapper.find(Skeleton)).toHaveLength(1);

    expect(wrapper.find(Text).at(0).text()).toEqual('Description');
    expect(wrapper.find(Text).at(1).text()).toEqual(initialProps.description);
    expect(wrapper.find(Text).at(2).text()).toEqual('Groups');
  });

  it('calls API fetch when expandedRequests is changed only one time', async () => {
    let wrapper;

    await act(async() => {
      wrapper = mount(<ComponentWrapper store={ store }><ExpandableContent { ...initialProps }/></ComponentWrapper>);
    });

    wrapper.update();

    expect(helpers.fetchGroupName.mock.calls).toHaveLength(initialProps.groupRefs.length);

    expect(wrapper.find(Skeleton)).toHaveLength(0);

    expect(wrapper.find(Text)).toHaveLength(4);
    expect(wrapper.find(Text).last().text().includes(groupName1)).toEqual(true);
    expect(wrapper.find(Text).last().text().includes(groupName2)).toEqual(true);
  });
});
