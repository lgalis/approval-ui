import { MemoryRouter } from 'react-router-dom';
import CommonApiError from '../../../smart-components/error-pages/common-api-error';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  EmptyStatePrimary
} from '@patternfly/react-core';

describe('<CommonApiError />', () => {
  const ComponentWrapper = ({ children, initialEntry }) => <MemoryRouter
    initialEntries={ [{ pathname: initialEntry, state: { from: { pathname: '/previous' }}}] }
    initialIndex={ 0 }
  >
    { children }
  </MemoryRouter>;

  it('renders correctly on 401 error', () => {
    const wrapper = mount(
      <ComponentWrapper initialEntry="/401">
        <CommonApiError />
      </ComponentWrapper>
    );

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(Title).text().includes('Unauthorized')).toEqual(true);
    expect(wrapper.find(EmptyStateBody).text().includes('You are not authorized to access this section')).toEqual(true);
    expect(wrapper.find(EmptyStatePrimary).text().includes('Go to landing page')).toEqual(true);
    expect(wrapper.find(Button).props().href).toEqual('.');
  });

  it('renders correctly on 403 error', () => {
    const wrapper = mount(
      <ComponentWrapper initialEntry="/403">
        <CommonApiError />
      </ComponentWrapper>
    );

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(Title).text().includes('You do not have access to Approval')).toEqual(true);
    expect(wrapper.find(EmptyStateBody).text().includes('Contact your organization administrator for more information')).toEqual(true);
    expect(wrapper.find(EmptyStatePrimary).text().includes('Go to landing page')).toEqual(true);
    expect(wrapper.find(Button).props().href).toEqual('.');
  });
});
