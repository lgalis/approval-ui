import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ExpandableContent from './expandable-content';
import { timeAgo }  from '../../helpers/shared/helpers';
import routes from '../../constants/routes';

export const createRows = (data) =>
  data.reduce((acc, { id,
    name,
    requester_name,
    created_at,
    notified_at,
    finished_at,
    state,
    decision,
    reason,
    number_of_children
  }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      state,
      number_of_children,
      cells: [
        <Fragment key={ id }><Link to={ { pathname: routes.requests.index, search: `?request=${id}` } }>{ name }</Link></Fragment>,
        requester_name,
        timeAgo(created_at),
        finished_at ? timeAgo(finished_at) : (notified_at ? timeAgo(notified_at) : timeAgo(created_at)),
        state,
        decision
      ]
    }, {
      parent: key * 2,
      fullWidth: true,
      cells: [{
        title: <ExpandableContent id={ id }
          number_of_children={ number_of_children }
          state={ state }
          reason={ reason }/>
      }]
    }
  ]), []);

