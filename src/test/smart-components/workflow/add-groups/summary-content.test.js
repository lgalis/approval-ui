import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SummaryContent from '../../../../smart-components/workflow/add-groups/summary-content';

describe('<SummaryContent />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      formData: {
        name: 'Group summary name',
        description: 'Group summary description',
        wfGroups: []
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<SummaryContent { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
