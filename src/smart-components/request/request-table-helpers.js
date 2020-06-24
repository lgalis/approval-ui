import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ExpandableContent from './expandable-content';
import { timeAgo }  from '../../helpers/shared/helpers';
import routes from '../../constants/routes';
import { Text, TextVariants } from '@patternfly/react-core';
import { decisionValues } from '../../utilities/constants';

const decisionIcon = (decision) => decisionValues[decision] ? decisionValues[decision].icon : '';
const decisionDisplayName = (decision) => decisionValues[decision] ? decisionValues[decision].displayName : '';

export const createRows = (data, actionsDisabled, type) => data.reduce((acc, request, key) => ([
  ...acc, {
    id: request.id,
    isOpen: false,
    state: request.state,
    number_of_children: request.number_of_children,
    cells: [
      <Fragment key={ request.id }>
        <Link to={
          { pathname: type === 'all' ? routes.allrequest.index : routes.request.index, search: `?request=${request.id}` } }>
          { request.id }
        </Link>
      </Fragment>,
      request.name,
      request.requester_name,
      timeAgo(request.created_at),
      request.finished_at ? timeAgo(request.finished_at) : (request.notified_at ? timeAgo(request.notified_at) : timeAgo(request.created_at)),
      request.state,
      <Fragment key={ `decision-${request.id}` }><Text key={ `${request.decision}-$(request.id}` }
        className="pf-u-mb-md" component={ TextVariants.p } >
        { decisionIcon(request.decision) } { `${decisionDisplayName(request.decision)}` }
      </Text></Fragment>
    ]
  }, {
    parent: key * 2,
    fullWidth: true,
    cells: [{
      title: <ExpandableContent actionsDisabled={ actionsDisabled(request) } id={ request.id }
        number_of_children={ request.number_of_children }
        state={ request.state }
        reason={ request.reason }/>
    }]
  }
]), []);
