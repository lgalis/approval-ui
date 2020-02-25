import requestReducer, { requestsInitialState } from '../../../redux/reducers/request-reducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_REQUEST,
  FETCH_REQUESTS,
  EXPAND_REQUEST
} from '../../../redux/action-types';

describe('Request reducer', () => {
  let initialState;
  const reducer = callReducer(requestReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state', () => {
    const expectedState = { isRequestDataLoading: true, expandedRequests: []};
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

  it('should set opened request', () => {
    const id = '54787';
    initialState = { expandedRequests: [ '123' ]};
    const expectedState = { expandedRequests: [ '123', id ]};
    expect(reducer(initialState, { type: EXPAND_REQUEST, payload: id })).toEqual(expectedState);
  });
});
