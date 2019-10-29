import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import StageInformation from '../../../../smart-components/workflow/add-stages/stage-information';

describe('<StageInformation />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      formData: {
        name: 'Stage info name test',
        description: 'Stage info description test'
      },
      handleChange: jest.fn(),
      title: 'Set stage info test'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<StageInformation { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
