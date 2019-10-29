import groupReducer, { groupsInitialState } from '../../../redux/reducers/group-reducer';
import { callReducer } from '../redux-helpers';
import { FETCH_RBAC_GROUPS } from '../../../redux/action-types';

describe('Group reducer', () => {
  const reducer = callReducer(groupReducer);
  it('should set loading state to true', () => {
    const expectedState = {
      ...groupsInitialState,
      isLoading: true
    };
    expect(reducer(groupsInitialState, { type: `${FETCH_RBAC_GROUPS}_PENDING` })).toEqual(expectedState);
  });

  it('should set groups and set loading state to false', () => {
    const expectedState = {
      groups: 'my groups',
      isLoading: false
    };

    expect(reducer(
      { ...groupsInitialState, isLoading: true },
      { type: `${FETCH_RBAC_GROUPS}_FULFILLED`, payload: 'my groups' }
    )).toEqual(expectedState);
  });
});
