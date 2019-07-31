import React from 'react';

import ExpandableContent from './expandable-content';

export const createRows = (data, filterValue = undefined) =>
  data.filter(item => { const filter = filterValue ? item.name.includes(filterValue) : true;
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

