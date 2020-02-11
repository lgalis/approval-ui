import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import WorkflowInfoForm from '../../../../smart-components/workflow/add-stages/stage-information';

describe('<WorkflowInfoForm />', () => {
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
    const wrapper = mount(<WorkflowInfoForm { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
