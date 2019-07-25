import React from 'react';

import ExpandableContent from './expandable-content';

export const createInitialRows = data =>
  data.filter(item => item.name !== 'Always approve').reduce((acc, { id, name, description, group_refs, group_names }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      selected: false,
      cells: [ name, description ]
    }, {
      parent: key * 2,
      cells: [{ title: <ExpandableContent description={ description } groupRefs={ group_refs } groupNames={ group_names } /> }]
    }
  ]), []);

