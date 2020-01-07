import React from 'react';

import ExpandableContent from './expandable-content';

export const createRows = (data, filterValue) =>
  data.filter(item => {
    const filter = filterValue ? item.name.includes(filterValue) : true;
    return (item.name !== 'Always approve') && filter;
  }).reduce((acc,
    { id,
      name,
      description,
      sequence,
      group_refs,
      group_names }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      selected: false,
      cells: [ name, description, sequence ]
    }, {
      parent: key * 2,
      cells: [{ title: <ExpandableContent description={ description } groupRefs={ group_refs } groupNames={ group_names } /> }]
    }
  ]), []);

