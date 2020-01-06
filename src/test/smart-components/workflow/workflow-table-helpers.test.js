import { createRows } from '../../../smart-components/workflow/workflow-table-helpers';

describe('workflow table helpers', () => {
  it('should create rows correctly', () => {
    const data = [{
      id: '1',
      name: 'foo',
      description: 'bar',
      sequence: '1',
      group_refs: [ 'group_refs' ],
      group_names: [ 'group_names' ]
    }, {
      name: 'should be in result',
      id: '2',
      description: 'baz',
      sequence: '2',
      group_refs: [ 'group_refs' ],
      group_names: [ 'group_names' ]
    }, {
      name: 'Always approve',
      id: 3,
      description: 'should not be in result'
    }];

    const expectedData = [{
      cells: [ 'should be in result', 'baz', '2' ],
      id: '2',
      isOpen: false,
      selected: false
    }, {
      cells: [{
        title: expect.any(Object)
      }],
      parent: 0
    }];
    expect(createRows(data, 'result')).toEqual(expectedData);
  });
});
