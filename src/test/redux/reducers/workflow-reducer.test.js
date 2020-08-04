import workflowReducer, { workflowsInitialState } from '../../../redux/reducers/workflow-reducer';
import { callReducer } from '../redux-helpers';

import {
  FETCH_WORKFLOW,
  FETCH_WORKFLOWS,
  SET_FILTER_WORKFLOWS,
  UPDATE_WORKFLOW,
  MOVE_SEQUENCE
} from '../../../redux/action-types';

describe('Approval process reducer', () => {
  let initialState;
  const reducer = callReducer(workflowReducer);

  beforeEach(() => {
    initialState = {};
  });

  it('should set loading state', () => {
    const expectedState = { isLoading: true };
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

  it('should set filter value', () => {
    const filterValue = 'some-name';
    initialState = { workflows: { meta: { offset: 100, limit: 50 }}};
    const expectedState = { filterValue, workflows: { meta: { offset: 0, limit: 50 }}};
    expect(reducer(initialState, { type: SET_FILTER_WORKFLOWS, payload: filterValue })).toEqual(expectedState);
  });

  it('should increase updating', () => {
    initialState = { isUpdating: 1 };
    const expectedState = { isUpdating: 2 };
    expect(reducer(initialState, { type: `${UPDATE_WORKFLOW}_PENDING` })).toEqual(expectedState);
  });

  it('should decrease updating on fulfilled', () => {
    initialState = { isUpdating: 1 };
    const expectedState = { isUpdating: 0 };
    expect(reducer(initialState, { type: `${UPDATE_WORKFLOW}_FULFILLED` })).toEqual(expectedState);
  });

  it('should decrease updating on rejected', () => {
    initialState = { isUpdating: 1 };
    const expectedState = { isUpdating: 0 };
    expect(reducer(initialState, { type: `${UPDATE_WORKFLOW}_REJECTED` })).toEqual(expectedState);
  });

  describe('sequence moving', () => {
    const id = '1234';
    const id2 = '987';

    const wf = (sequence, wfId = id) => ({
      id: wfId,
      sequence
    });

    let sequence;

    describe('direction = asc', () => {
      it('should move up', () => {
        sequence = 10;
        initialState = { sortBy: { direction: 'asc' }, workflows: { data: [ wf(1) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(sequence) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });

      it('should move down', () => {
        sequence = 1;
        initialState = { sortBy: { direction: 'asc' }, workflows: { data: [ wf(10) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(sequence) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });

      it('should move up and switch', () => {
        sequence = 11;
        initialState = { sortBy: { direction: 'asc' }, workflows: { data: [ wf(10), wf(11, id2) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(10, id2), wf(11) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });

      it('should move down and switch', () => {
        sequence = 10;
        initialState = { sortBy: { direction: 'asc' }, workflows: { data: [ wf(10, id2), wf(11) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(10), wf(11, id2) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });
    });

    describe('direction = desc', () => {
      it('should move up', () => {
        sequence = 10;
        initialState = { sortBy: { direction: 'desc' }, workflows: { data: [ wf(1) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(sequence) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });

      it('should move down', () => {
        sequence = 1;
        initialState = { sortBy: { direction: 'desc' }, workflows: { data: [ wf(10) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(sequence) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });

      it('should move up and switch', () => {
        sequence = 11;
        initialState = { sortBy: { direction: 'desc' }, workflows: { data: [ wf(11, id2), wf(10) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(11), wf(10, id2) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });

      it('should move down and switch', () => {
        sequence = 10;
        initialState = { sortBy: { direction: 'desc' }, workflows: { data: [ wf(11), wf(10, id2) ]}};
        const expectedState = { ...initialState, workflows: { data: [ wf(11, id2), wf(10) ]}};
        expect(reducer(initialState, { type: MOVE_SEQUENCE, payload: { id, sequence }})).toEqual(expectedState);
      });
    });
  });
});
