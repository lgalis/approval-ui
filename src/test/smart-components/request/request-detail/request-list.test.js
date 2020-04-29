import React from 'react';
import { mount } from 'enzyme';

import RequestList from '../../../../smart-components/request/request-detail/request-list';
import { DataListLoader } from '../../../../presentational-components/shared/loader-placeholders';
import Group from '../../../../smart-components/request/request-detail/request';

describe('<RequestList />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      noItems: 'No items to render',
      id: 'foo'
    };
  });

  it('should render in loading', () => {
    const wrapper = mount(<RequestList { ...initialProps } isLoading/>);
    expect(wrapper.find(DataListLoader)).toHaveLength(1);
  });

  it('should expect a request list item', () => {
    const wrapper = mount(<RequestList { ...initialProps } items={ [{
      id: 'foo',
      actions: []
    }] }/>);
    expect(wrapper.find(Group)).toHaveLength(1);
    const button = wrapper.find('button.pf-c-button.pf-m-plain');
    expect(button.props().className).toEqual('pf-c-button pf-m-plain');
    button.simulate('click');
    expect(wrapper.state()).toEqual({ expanded: [ 'request-foo' ]});
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
      children: [
        'Group Name',
        ' '
      ],
      id: '1-name'
    });
  });

});
