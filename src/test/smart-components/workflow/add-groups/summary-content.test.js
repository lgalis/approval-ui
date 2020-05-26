import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SummaryContent from '../../../../smart-components/workflow/add-groups/summary-content';
import rendererContext from '@data-driven-forms/react-form-renderer/dist/cjs/renderer-context';

describe('<SummaryContent />', () => {
  let formData;

  beforeEach(() => {
    formData = {
      name: 'Group summary name',
      description: 'Group summary description',
      wfGroups: []
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<rendererContext.Provider value={ { formOptions: {
      getState: () => ({
        values: formData
      })
    }} }>
      <SummaryContent />
    </rendererContext.Provider>);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
