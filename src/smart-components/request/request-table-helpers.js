import React from 'react';

import ExpandableContent from './expandable-content';
import { timeAgo }  from '../../helpers/shared/helpers';

export const createInitialRows = data =>
  data.reduce((acc, { id, requester, created_at, updated_at, state, decision, content }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      cells: [ id, requester, timeAgo(created_at), timeAgo(updated_at), state, decision ]
    }, {
      parent: key * 2,
      cells: [{ title: <ExpandableContent id={ id } content={ content } /> }]
    }
  ]), []);

