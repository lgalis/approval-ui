import workflowReducer, { workflowsInitialState } from '../../../redux/reducers/workflow-reducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS,
  EXPAND_WORKFLOW
} from '../../../redux/action-types';

describe('Approval process reducer', () => {
  let initialState;
  const reducer = callReducer(workflowReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state', () => {
    const expectedState = { isLoading: true, expandedWorkflows: []};
    expect(reducer(initialState, { type: `${FETCH_WORKFLOWS}_PENDING` })).toEqual(expectedState);
  });

  it('should set approval processes data and set loading state to false', () => {
    const payload = { data: 'Foo' };
    const expectedState = { isLoading: false, workflows: payload };
    expect(reducer(initialState, { type: `${FETCH_WORKFLOWS}_FULFILLED`, payload })).toEqual(expectedState);
  });

  it('should set record loading state', () => {
    const expectedState = { ... workflowsInitialState, isRecordLoading: true };
    expect(reducer({ ...workflowsInitialState }, { type: `${FETCH_WORKFLOW}_PENDING` })).toEqual(expectedState);
  });

  it('should select approval process and set record loading state to true', () => {
    const expectedState = { ... workflowsInitialState, isRecordLoading: false, workflow: 'my workflow' };
    expect(reducer({ ...workflowsInitialState }, { type: `${FETCH_WORKFLOW}_FULFILLED`, payload: 'my workflow' })).toEqual(expectedState);
  });

  it('should set expanded approval process', () => {
    const id = '54787';
    initialState = { expandedWorkflows: [ '123' ]};
    const expectedState = { expandedWorkflows: [ '123', id ]};
    expect(reducer(initialState, { type: EXPAND_WORKFLOW, payload: id })).toEqual(expectedState);
  });
});
