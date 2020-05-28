import { MemoryRouter, Route, Redirect } from 'react-router-dom';
import UserContext from '../../user-context';
import ProtectedRoute from '../../routing/protected-route';
import { APPROVAL_ADMINISTRATOR_ROLE } from '../../helpers/shared/helpers';

describe('<ProtectedRoute />', () => {
  const ComponentWrapper = ({ children, value }) => <MemoryRouter initialEntries={ [ '/initial' ] } initialIndex={ 0 }>
    <UserContext.Provider value={ value }>
      <Route path="/initial">
        { children }
      </Route>
    </UserContext.Provider>
  </MemoryRouter>;

  it('is admin', () => {
    const roles = {};
    roles[APPROVAL_ADMINISTRATOR_ROLE] = true;
    const wrapper = mount(
      <ComponentWrapper value={ { userRoles: roles } }>
        <ProtectedRoute />
      </ComponentWrapper>
    );

    expect(wrapper.find(Route)).toHaveLength(2);
    expect(wrapper.find(Redirect)).toHaveLength(0);
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/initial');
  });

  it('is not admin', () => {
    const wrapper = mount(
      <ComponentWrapper value={ { userRoles: {}} }>
        <ProtectedRoute />
      </ComponentWrapper>
    );

    expect(wrapper.find(Route)).toHaveLength(1);
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/403');
  });
});
