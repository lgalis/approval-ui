import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

import ExpandableContent from './expandable-content';
import { timeAgo }  from '../../helpers/shared/helpers';

export const createInitialRows = data =>
  data.reduce((acc, { id, requester, created_at, updated_at, active_stage, total_stages, state, decision, reason, content }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      state,
      cells: [ <Fragment key={ id }><Link to={ `/requests/detail/${id}` }>
        <Button variant="link"> { id } </Button></Link></Fragment>, requester,
      timeAgo(created_at), timeAgo(updated_at), `${active_stage} of ${total_stages}`, decision ]
    }, {
      parent: key * 2,
      fullWidth: true,
      cells: [{ title: <ExpandableContent id={ id }
        content={ content }
        state={ state }
        total_stages={ total_stages }
        decision={ decision }
        reason={ reason }/> }]
    }
  ]), []);

