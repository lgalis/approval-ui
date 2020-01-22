import React from 'react';

import ExpandableContent from './expandable-content';

export const createRows = (data) =>
  data.filter(item => {
    return (item.name !== 'Always approve');
  }).reduce((acc,
    {
      id,
      name,
      description,
      sequence,
      group_refs
    }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      selected: false,
      cells: [ name, description, sequence ]
    }, {
      parent: key * 2,
      cells: [{ title: <ExpandableContent
        description={ description }
        groupRefs={ group_refs }
        id={ id }
      /> }]
    }
  ]), []);

