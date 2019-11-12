import React from 'react';
import { mount } from 'enzyme';

import StageList from '../../../../smart-components/request/request-detail/stage-list';
import { DataListLoader } from '../../../../presentational-components/shared/loader-placeholders';
import Stage from '../../../../smart-components/request/request-detail/stage';

describe('<StageList />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      noItems: 'No items to render',
      id: 'foo'
    };
  });

  it('should render in loading', () => {
    const wrapper = mount(<StageList { ...initialProps } isLoading/>);
    expect(wrapper.find(DataListLoader)).toHaveLength(1);
  });

  it('should expact stage list item', () => {
    const wrapper = mount(<StageList { ...initialProps } items={ [{
      id: 'foo',
      stageActions: {
        data: []
      }
    }] }/>);
    expect(wrapper.find(Stage)).toHaveLength(1);
    const button = wrapper.find('button.pf-c-button.pf-m-plain');
    expect(button.props().className).toEqual('pf-c-button pf-m-plain');
    button.simulate('click');
    expect(wrapper.state()).toEqual({ expanded: [ 'stage-foo' ]});
  });
});
