
import React from 'react';
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
      id: '1',
      selected: false,
      cells: [
        '2',
        'foo',
        'bar',
        <React.Fragment key="1"><GroupsLabels key="1" group_refs={ [{ name: 'group_refs', uuid: 'group_uuid' }] } id="1" /></React.Fragment>
      ]
    }, {
      id: '2',
      selected: false,
      cells: [
        '1',
        'should be in result',
        'baz',
        <React.Fragment key="2"><GroupsLabels key="2" group_refs={ [{ name: 'group_refs', uuid: 'group_uuid' }] } id="2"/></React.Fragment>
      ]
    }];
    expect(JSON.stringify(createRows(data, 'result'))).toEqual(JSON.stringify(expectedData));
  });
});
