import workflowReducer from '../../../redux/reducers/workflowReducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_WORKGROUPS
} from '../../../redux/ActionTypes';

describe('Workflow reducer', () => {
  let initialState;
  const reducer = callReducer(workflowReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state', () => {
    const expectedState = { isLoading: true };
    expect(reducer(initialState, { type: `${FETCH_WORKGROUPS}_PENDING` })).toEqual(expectedState);
  });

  it('should set workflows data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = { isLoading: false, workflows: payload };
    expect(reducer(initialState, { type: `${FETCH_WORKGROUPS}_FULFILLED`, payload })).toEqual(expectedState);
  });

});
