import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SetStages from '../../../../smart-components/workflow/add-stages/set-stages';

describe('<SetStages />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      formData: {
        wfGroups: []
      },
      handleChange: jest.fn(),
      options: [],
      title: 'Set stages test'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<SetStages { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
