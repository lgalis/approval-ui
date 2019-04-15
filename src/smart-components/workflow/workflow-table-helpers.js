import React from 'react';

import ExpandableContent from './expandable-content';

export const createInitialRows = data =>
  data.filter(item => item.name !== 'Always approve').reduce((acc, { id, name, description, group_names }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      cells: [ name, description, group_names.length ]
    }, {
      parent: key * 2,
      cells: [{ title: <ExpandableContent description={ description } groups={ group_names } /> }]
    }
  ]), []);

