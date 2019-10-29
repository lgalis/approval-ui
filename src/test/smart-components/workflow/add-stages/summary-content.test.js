import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SummaryContent from '../../../../smart-components/workflow/add-stages/summary-content';

describe('<SummaryContent />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      formData: {
        name: 'Stage summary name',
        description: 'Stage summary description',
        wfGroups: []
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<SummaryContent { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
