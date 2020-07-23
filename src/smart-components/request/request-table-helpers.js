import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo }  from '../../helpers/shared/helpers';
import routes from '../../constants/routes';
import { Label } from '@patternfly/react-core';
import { decisionValues, untranslatedMessage } from '../../utilities/constants';

const decisionIcon = (decision) => decisionValues[decision] ? decisionValues[decision].icon : undefined;
const decisionDisplayName = (decision) => decisionValues[decision] ? decisionValues[decision].displayName : untranslatedMessage();
const decisionColor = (decision) => decisionValues[decision] ? decisionValues[decision].color : undefined;

export const capitlize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const createRows = (actionResolver) => (data, actionsDisabled, indexpath = routes.request, intl) => data.reduce((acc, request, key) => ([
  ...acc, {
    id: request.id,
    state: request.state,
    number_of_children: request.number_of_children,
    cells: [
      <Fragment key={ request.id }>
        <Link to={
          { pathname: indexpath.index, search: `?request=${request.id}` } }>
          { request.id }
        </Link>
      </Fragment>,
      request.name,
      request.requester_name,
      request.finished_at ? timeAgo(request.finished_at) : (request.notified_at ? timeAgo(request.notified_at) : timeAgo(request.created_at)),
      <Fragment key={ `decision-${request.id}` }>
        { actionResolver(request) || (<Label
          variant="outline"
          icon={ decisionIcon(request.decision) }
          color={ decisionColor(request.decision) }
        >
          { capitlize(intl.formatMessage(decisionDisplayName(request.decision))) }
        </Label>) }
      </Fragment>
    ]
  }
]), []);
