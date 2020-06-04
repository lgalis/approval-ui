import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ExpandableContent from './expandable-content';
import { timeAgo }  from '../../helpers/shared/helpers';
import routes from '../../constants/routes';
import { Text } from '@patternfly/react-core';
import { decisionValues } from '../../utilities/constants';

const decisionIcon = (decision) => decisionValues[decision] ? decisionValues[decision].icon : '';
const decisionDisplayName = (decision) => decisionValues[decision] ? decisionValues[decision].displayName : '';

export const createRows = (data, actionsDisabled ) =>
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
        <Fragment key={ id }><Link to={ { pathname: routes.request.index, search: `?request=${id}` } }>{ id }</Link></Fragment>,
        name,
        requester_name,
        timeAgo(created_at),
        finished_at ? timeAgo(finished_at) : (notified_at ? timeAgo(notified_at) : timeAgo(created_at)),
        state,
        <Fragment key={ `decision-${id}` }><Text key={ `${decision}-$(id}` } style={ { marginBottom: 0 } }
          className="data-table-detail content">
          { decisionIcon(decision) } { `${decisionDisplayName(decision)}` }
        </Text></Fragment>
      ]
    }, {
      parent: key * 2,
      fullWidth: true,
      cells: [{
        title: <ExpandableContent actionsDisabled={actionsDisabled} id={ id }
          number_of_children={ number_of_children }
          state={ state }
          reason={ reason }/>
      }]
    }
  ]), []);

