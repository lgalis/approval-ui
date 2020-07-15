import React from 'react';
import { mount as enzymeMount } from 'enzyme';

import RequestList from '../../../../smart-components/request/request-detail/request-list';
import { DataListLoader } from '../../../../presentational-components/shared/loader-placeholders';
import { IntlProvider } from 'react-intl';
import { Request } from '../../../../smart-components/request/request-detail/request';

const mount = (children) => enzymeMount(<IntlProvider locale="en">{ children }</IntlProvider>);

describe('<RequestList />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      noItems: 'No items to render',
      id: 'foo',
      group_name: 'Group'
    };
  });

  it('should render in loading', () => {
    const wrapper = mount(<RequestList { ...initialProps } isLoading/>);
    expect(wrapper.find(DataListLoader)).toHaveLength(1);
  });

  it('should expect a request list item', () => {
    const wrapper = mount(<RequestList { ...initialProps } items={ [{
      id: 'foo',
      group_name: 'Group',
      actions: []
    }] }/>);
    expect(wrapper.find(Request).props().isExpanded).toEqual(false);

    const button = wrapper.find('button.pf-c-button.pf-m-plain');
    expect(button.props().className).toEqual('pf-c-button pf-m-plain');
    button.simulate('click');
    expect(wrapper.find(Request).props().isExpanded).toEqual(true);
  });

  it('should use the group name for sub-requests', () => {
    const wrapper = mount(<RequestList { ...initialProps } items={ [{
      id: '1',
      parent_id: '100',
      group_name: 'Group Name',
      name: 'Name',
      actions: []
    }] }/>);
    const title = wrapper.find('span');
    expect(title.first().props()).toEqual({
      children: 'Group Name',
      id: '1-name'
    });
  });
});
