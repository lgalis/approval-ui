import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SummaryContent from '../../../../smart-components/workflow/add-groups/summary-content';
import rendererContext from '@data-driven-forms/react-form-renderer/dist/cjs/renderer-context';

describe('<SummaryContent />', () => {
  let formData;

  it('should render correctly without groups', () => {
    formData = {
      name: 'Group summary name',
      description: 'Group summary description',
      wfGroups: []
    };

    const wrapper = mount(<rendererContext.Provider value={ { formOptions: {
      getState: () => ({ values: formData })
    }} }>
      <SummaryContent />
    </rendererContext.Provider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render correctly with groups', () => {
    formData = {
      name: 'Group summary name',
      description: 'Group summary description',
      wfGroups: [
        { value: '1', label: 'Group 1' },
        { value: 'G2', label: 'Group 2' }
      ]
    };

    const wrapper = mount(<rendererContext.Provider value={ { formOptions: {
      getState: () => ({ values: formData })
    }} }>
      <SummaryContent />
    </rendererContext.Provider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
