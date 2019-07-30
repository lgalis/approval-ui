import React from 'react';

import ExpandableContent from './expandable-content';

export const createInitialRows = (data, searchFilter = undefined) =>
  data.filter(item => { const filter = searchFilter ? item.name.include(searchFilter) : true;
    return (item.name !== 'Always approve') && filter; }).reduce((acc,
    { id,
      name,
      description,
      group_refs,
      group_names }, key) => ([
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

