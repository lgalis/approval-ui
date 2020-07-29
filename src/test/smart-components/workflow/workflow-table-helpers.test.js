
import { createRows, GroupsLabels } from '../../../smart-components/workflow/workflow-table-helpers';

describe('approval process table helpers', () => {
  it('should create rows correctly', () => {
    const data = [{
      id: '1',
      name: 'foo',
      description: 'bar',
      sequence: '2',
      group_refs: [{ name: 'group_refs', uuid: 'group_uuid' }]
    }, {
      name: 'should be in result',
      id: '2',
      description: 'baz',
      sequence: '1',
      group_refs: [{ name: 'group_refs', uuid: 'group_uuid' }]
    }];

    const expectedData = [{
      cells: [ '2', 'foo', 'bar', <GroupsLabels id="1" key={ 1 } group_refs={ [{ name: 'group_refs', uuid: 'group_uuid' }] } /> ],
      id: '1',
      selected: false
    }, {
      cells: [ '1', 'should be in result', 'baz', <GroupsLabels id="2" key={ 2 } group_refs={ [{ name: 'group_refs', uuid: 'group_uuid' }] } /> ],
      id: '2',
      selected: false
    }];
    expect(createRows(data, 'result')).toEqual(expectedData);
  });
});
