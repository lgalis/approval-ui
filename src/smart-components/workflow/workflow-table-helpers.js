import React from 'react';

import ExpandableContent from './expandable-content';

export const createInitialRows = data => data.reduce((acc, { id, name, description, groups }, key) => ([
  ...acc, {
    id,
    isOpen: false,
    cells: [ name, description, groups.length ]
  }, {
    parent: key * 2,
    cells: [{ title: <ExpandableContent description={ description } groups={ groups } /> }]
  }
]), []);

