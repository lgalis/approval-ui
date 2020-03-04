import store from '../../utilities/store';

describe('Redux store', () => {
  it('should create redux store', () => {
    const approvalStore = store;
    const expectedState = {
      groupReducer: expect.any(Object),
      requestReducer: expect.any(Object),
      workflowReducer: expect.any(Object),
      rolesReducer: expect.any(Object),
      notifications: []
    };
    expect(approvalStore.dispatch).toBeInstanceOf(Function);
    expect(approvalStore.getState).toBeInstanceOf(Function);
    expect(approvalStore.getState()).toEqual(expectedState);
  });
});
