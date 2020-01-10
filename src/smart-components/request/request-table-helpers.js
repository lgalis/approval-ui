import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

import ExpandableContent from './expandable-content';
import { timeAgo }  from '../../helpers/shared/helpers';

export const createRows = (data, filterValue) =>
  data.filter(item => { const filter = filterValue ? item.id.includes(filterValue) : true;
    return filter; }).reduce((acc, { id,
    name,
    requester_name,
    created_at,
    updated_at,
    state,
    decision,
    reason,
    number_of_children,
    content }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      state,
      number_of_children,
      cells: [ <Fragment key={ id }><Link to={ `/requests/detail/${id}` }>
        <Button variant="link"> { name } </Button></Link></Fragment>, requester_name,
      timeAgo(created_at), timeAgo(updated_at), state, decision ]
    }, {
      parent: key * 2,
      fullWidth: true,
      cells: [{ title: <ExpandableContent id={ id }
        content={ content }
        state={ state }
        reason={ reason }/> }]
    }
  ]), []);

