import { createRows } from '../../../smart-components/workflow/workflow-table-helpers';
import ExpandableContent from '../../../smart-components/workflow/expandable-content';

describe('workflow table helpers', () => {
  it('should create rows correctly', () => {
    const data = [{
      id: '1',
      name: 'foo',
      description: 'bar',
      sequence: '2',
      group_refs: [ 'group_refs' ],
      group_names: [ 'group_names' ]
    }, {
      name: 'should be in result',
      id: '2',
      description: 'baz',
      sequence: '1',
      group_refs: [ 'group_refs' ],
      group_names: [ 'group_names' ]
    }, {
      name: 'Always approve',
      id: 3,
      description: 'should not be in result'
    }];

    const expectedData = [{
      cells: [ 'foo', 'bar', '2' ],
      id: '1',
      isOpen: false,
      selected: false
    },
    {
      cells: [{
        title: <ExpandableContent
          description="bar"
          groupNames={ [ 'group_names' ] }
          groupRefs={ [ 'group_refs' ] }
          iFetching={ false }
        />
      }],
      parent: 0
    },      {
      cells: [ 'should be in result', 'baz', '1' ],
      id: '2',
      isOpen: false,
      selected: false
    }, {
      cells: [{
        title: <ExpandableContent
          description="baz"
          groupNames={ [ 'group_names' ] }
          groupRefs={ [ 'group_refs' ] }
          iFetching={ false }
        />
      }],
      parent: 2
    }];
    expect(createRows(data, 'result')).toEqual(expectedData);
  });
});
