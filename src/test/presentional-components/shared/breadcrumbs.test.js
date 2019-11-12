import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import ApprovalBreadcrumbs from '../../../presentational-components/shared/breadcrubms';

describe('<ApprovalBreadcrumbs />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      breadcrumbs: [{
        title: 'First level',
        to: '/first-level'
      }, {
        title: 'Second level',
        isActive: true
      }]
    };
  });

  it('should render breadcrumbs', () => {
    const wrapper = mount(
      <MemoryRouter>
        <ApprovalBreadcrumbs { ...initialProps } />
      </MemoryRouter>
    );

    expect(toJson(wrapper.find(ApprovalBreadcrumbs))).toMatchSnapshot();
  });

  it('should not render if no data is provided', () => {
    const wrapper = mount(
      <MemoryRouter>
        <ApprovalBreadcrumbs />
      </MemoryRouter>
    );

    expect(toJson(wrapper.find(ApprovalBreadcrumbs))).toMatchSnapshot();
  });
});
