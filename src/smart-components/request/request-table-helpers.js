import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo }  from '../../helpers/shared/helpers';
import routes from '../../constants/routes';
import { Label } from '@patternfly/react-core';
import { decisionValues, untranslatedMessage } from '../../utilities/constants';

export const capitlize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const createRows = (actionResolver, data, indexpath = routes.request, intl) => data.reduce((acc, request) => ([
  ...acc, {
    id: request.id,
    state: request.state,
    number_of_children: request.number_of_children,
    cells: [
      <Fragment key={ request.id } ouiaId={ request.id }>
        <Link to={
          { pathname: indexpath.index, search: `?request=${request.id}` } }>
          { request.id }
        </Link>
      </Fragment>,
      request.name,
      request.requester_name,
      request.finished_at ? timeAgo(request.finished_at) : (request.notified_at ? timeAgo(request.notified_at) : timeAgo(request.created_at)),
      <Fragment key={ `decision-${request.id}` } ouiaId={ `decision-${request.id}` }>
        { actionResolver(request) || (<Label
          variant="outline"
          icon={ decisionValues[request.decision]?.icon }
          color={ decisionValues[request.decision]?.color }
        >
          { capitlize(intl.formatMessage(
              decisionValues[request.decision]?.displayName || untranslatedMessage()
          )) }
        </Label>) }
      </Fragment>
    ]
  }
]), []);
