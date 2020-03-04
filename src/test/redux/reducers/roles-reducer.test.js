import rolesReducer, { rolesInitialState } from '../../../redux/reducers/roles-reducer';
import { callReducer } from '../redux-helpers';
import { SET_USER_ROLES } from '../../../redux/action-types';

describe('Roles reducer', () => {
  const reducer = callReducer(rolesReducer);

  it('should set the approval admin flag to true if the user has Approval Administrator role', () => {
    const expectedState = {
      userRoles: [{ name: 'Approval Administrator' }],
      approvalAdmin: true
    };

    expect(reducer(
      { ...rolesInitialState },
      { type: `${SET_USER_ROLES}`, payload: [{ name: 'Approval Administrator' }]}
    )).toEqual(expectedState);
  });

  it('should set the approval admin flag to false if the user has no Approval Administrator role', () => {
    const expectedState = {
      userRoles: [{ name: 'Approval Approver' }],
      approvalAdmin: false
    };

    expect(reducer(
      { ...rolesInitialState },
      { type: `${SET_USER_ROLES}`, payload: [{ name: 'Approval Approver' }]}
    )).toEqual(expectedState);
  });
});
