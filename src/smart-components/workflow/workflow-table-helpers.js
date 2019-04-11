import React from 'react';

import ExpandableContent from './expandable-content';

export const createInitialRows = data => data.reduce((acc, { id, name, description, group_refs }, key) => ([
  ...acc, {
    id,
    isOpen: false,
    cells: [ name, description, group_refs.length ]
  }, {
    parent: key * 2,
    cells: [{ title: <ExpandableContent description={ description } groups={ group_refs } /> }]
  }
]), []);

