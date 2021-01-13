import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Button } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import requestsMessages from '../../messages/requests.messages';
import { isRequestStateActive } from '../../helpers/shared/helpers';

const RequestActions = ({
  denyLink,
  approveLink,
  commentLink,
  request,
  canApproveDeny,
  canComment
}) => {
  const intl = useIntl();

  const { id, state } = request;
  const approveDenyAllowed = isRequestStateActive(state) && canApproveDeny;
  const commentAllowed = canComment;

  return (
    <div style={ { display: 'flex' } }>
      { approveDenyAllowed && (<React.Fragment>
        <Link
          to={ { pathname: approveLink, search: `request=${id}` } }
          className="pf-u-mr-sm"
          id={ `approve-${request.id}` }
        >
          <Button
            ouiaId={ `approve-request-${id}` }
            variant="primary"
            aria-label={ intl.formatMessage(requestsMessages.approveRequest) }
          >
            { intl.formatMessage(requestsMessages.approveTitle) }
          </Button>
        </Link>
        <Link
          to={ { pathname: denyLink, search: `request=${id}` } }
          className="pf-u-mr-sm"
          id={ `deny-${request.id}` }
        >
          <Button
            ouiaId={ `deny-request-${id}` }
            variant="danger"
            aria-label={ intl.formatMessage(requestsMessages.denyTitle) }
          >
            { intl.formatMessage(requestsMessages.denyTitle) }
          </Button>
        </Link>
      </React.Fragment>) }
      { commentAllowed && <Link
        to={ { pathname: commentLink, search: `request=${id}` } }
        id={ `comment-${request.id}` }
      >
        <Button
          ouiaId={ `comment-request-${id}` }
          variant="secondary"
          aria-label={ intl.formatMessage(requestsMessages.commentTitle) }
        >
          { intl.formatMessage(requestsMessages.commentTitle) }
        </Button>
      </Link> }
    </div>
  );
};

RequestActions.propTypes = {
  denyLink: PropTypes.string,
  approveLink: PropTypes.string,
  commentLink: PropTypes.string,
  request: PropTypes.object.isRequired,
  canApproveDeny: PropTypes.bool,
  canComment: PropTypes.bool
};

RequestActions.defaultProps = {
  canApproveDeny: true,
  canComment: true
};

export default RequestActions;
