import { MemoryRouter } from 'react-router-dom';
import CommonApiError from '../../../smart-components/error-pages/common-api-error';
import { Bullseye, Button, EmptyState, EmptyStateIcon, Title, EmptyStateBody } from '@patternfly/react-core';

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

    expect(wrapper.find(Bullseye)).toHaveLength(1);
    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(Title).text().includes('Unauthorized')).toEqual(true);
    expect(wrapper.find(EmptyStateBody).text().includes('You are not authorized to access this section')).toEqual(true);
    expect(wrapper.find(EmptyStateBody).text().includes('/previous')).toEqual(true);
    expect(wrapper.find(Button).props().href).toEqual('.');
  });
});
