import { TextContent, Text, Bullseye, Button } from '@patternfly/react-core';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import ExpandableContent, { ExpandedItem } from '../../../smart-components/request/expandable-content';
import * as helpers from '../../../helpers/request/request-helper';

describe('requests - expendableContent', () => {
  describe('ExpandedItem', () => {
    const title = 'This is title';
    const detail = 'A detail here';

    it('renders correctly', () => {
      const wrapper = mount(<ExpandedItem title={ title } detail={ detail }/>);

      expect(wrapper.find(TextContent)).toHaveLength(1);
      expect(wrapper.find(Text)).toHaveLength(2);
      expect(wrapper.find(Text).first().text()).toEqual(title);
      expect(wrapper.find(Text).last().text()).toEqual(detail);
    });

    it('renders correctly without title', () => {
      const wrapper = mount(<ExpandedItem title={ undefined } detail={ detail }/>);

      expect(wrapper.find(TextContent)).toHaveLength(1);
      expect(wrapper.find(Text)).toHaveLength(2);
      expect(wrapper.find(Text).first().text()).toEqual('');
      expect(wrapper.find(Text).last().text()).toEqual(detail);
    });

    it('renders correctly without detail', () => {
      const wrapper = mount(<ExpandedItem title={ title } detail={ undefined }/>);

      expect(wrapper.find(TextContent)).toHaveLength(1);
      expect(wrapper.find(Text)).toHaveLength(2);
      expect(wrapper.find(Text).first().text()).toEqual(title);
      expect(wrapper.find(Text).last().text()).toEqual('');
    });
  });

  describe('ExpandableContent', () => {
    const middlewares = [ thunk, promiseMiddleware(), notificationsMiddleware() ];
    let mockStore;
    let initialState;
    let mockStoreFn;
    let store;
    let initialProps;
    let id;
    let requestDetail;

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
      initialState = { requestReducer: { expandedRequests: []}};
      mockStoreFn = jest.fn().mockImplementation(() => initialState);
      store = mockStore(mockStoreFn);
      initialProps = { id, number_of_children: '', state: 'state', reason: 'reason' };
      requestDetail = {
        product: 'CostManagement',
        platform: 'Linux',
        portfolio: 'Very'
      };
      helpers.fetchRequestContent = jest.fn().mockImplementation(() => Promise.resolve(requestDetail));
    });

    it('renders correctly when loading', () => {
      const wrapper = mount(<ComponentWrapper store={ store }><ExpandableContent { ...initialProps }/></ComponentWrapper>);

      expect(wrapper.find(Spinner)).toHaveLength(1);
      expect(wrapper.find(Bullseye)).toHaveLength(1);
    });

    it('calls API fetch when expandedRequests is changed only one time', async () => {
      mockStoreFn.mockImplementation(() => ({ requestReducer: { expandedRequests: [ id ]}}));

      let wrapper;

      await act(async() => {
        wrapper = mount(<ComponentWrapper store={ store }><ExpandableContent { ...initialProps }/></ComponentWrapper>);
      });

      wrapper.update();

      expect(helpers.fetchRequestContent).toHaveBeenCalled();
      expect(helpers.fetchRequestContent.mock.calls).toHaveLength(1);

      expect(wrapper.find(ExpandedItem)).toHaveLength(4);

      expect(wrapper.find(Button)).toHaveLength(0);
    });

    it('renders with buttons', async () => {
      mockStoreFn.mockImplementation(() => ({ requestReducer: { expandedRequests: [ id ]}}));

      let wrapper;

      await act(async() => {
        wrapper = mount(<ComponentWrapper store={ store }><ExpandableContent { ...initialProps } state="pending"/></ComponentWrapper>);
      });

      wrapper.update();

      expect(wrapper.find(ExpandedItem)).toHaveLength(4);
      expect(wrapper.find(Button)).toHaveLength(2);
    });
  });
});
