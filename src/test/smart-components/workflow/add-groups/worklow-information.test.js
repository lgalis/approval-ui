import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import WorkflowInfoForm from '../../../../smart-components/workflow/add-groups/workflow-information';

describe('<WorkflowInfoForm />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      formData: {
        name: 'Group info name test',
        description: 'Group info description test'
      },
      handleChange: jest.fn(),
      isValid: jest.fn(),
      title: 'Set group info test'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<WorkflowInfoForm { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
