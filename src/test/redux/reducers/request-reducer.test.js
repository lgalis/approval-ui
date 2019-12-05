import requestReducer, { requestsInitialState } from '../../../redux/reducers/request-reducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_REQUEST,
  FETCH_REQUESTS
} from '../../../redux/action-types';

describe('Request reducer', () => {
  let initialState;
  const reducer = callReducer(requestReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state', () => {
    const expectedState = { isRequestDataLoading: true };
    expect(reducer(initialState, { type: `${FETCH_REQUESTS}_PENDING` })).toEqual(expectedState);
  });

  it('should set requests data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = { isRequestDataLoading: false, requests: payload };
    expect(reducer(initialState, { type: `${FETCH_REQUESTS}_FULFILLED`, payload })).toEqual(expectedState);
  });

  it('should set single request and set loading state to false', () => {
    const expectedState = {
      ...requestsInitialState,
      isRequestDataLoading: false,
      selectedRequest: 'single request'
    };
    expect(reducer(
      { ...requestsInitialState, isRequestDataLoading: true },
      { type: `${FETCH_REQUEST}_FULFILLED`, payload: 'single request' }
    ))
    .toEqual(expectedState);

  });
});
