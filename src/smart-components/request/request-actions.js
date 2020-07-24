import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Button } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import requestsMessages from '../../messages/requests.messages';
import { isRequestStateActive } from '../../helpers/shared/helpers';

const JustChildren = ({ children, className }) => <span className={ className }>{ children }</span>;

JustChildren.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

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
  const commentAllowed = isRequestStateActive(state) && canComment;

  const ApproveDenyLink = approveDenyAllowed ? Link : JustChildren;
  const CommentLink = commentAllowed ? Link : JustChildren;

  return (
    <div style={ { display: 'flex' } }>
      <ApproveDenyLink
        to={ { pathname: approveLink, search: `request=${id}` } }
        className="pf-u-mr-sm"
        id={ `approve-${request.id}` }
      >
        <Button
          variant="primary"
          aria-label={ intl.formatMessage(requestsMessages.approveRequest) }
          isDisabled={ !approveDenyAllowed }
        >
          { intl.formatMessage(requestsMessages.approveTitle) }
        </Button>
      </ApproveDenyLink>
      <ApproveDenyLink
        to={ { pathname: denyLink, search: `request=${id}` } }
        className="pf-u-mr-sm"
        id={ `deny-${request.id}` }
      >
        <Button
          variant="danger"
          isDisabled={ !approveDenyAllowed }
          aria-label={ intl.formatMessage(requestsMessages.denyTitle) }
        >
          { intl.formatMessage(requestsMessages.denyTitle) }
        </Button>
      </ApproveDenyLink>
      <CommentLink
        to={ { pathname: commentLink, search: `request=${id}` } }
        id={ `comment-${request.id}` }
      >
        <Button
          variant="secondary"
          isDisabled={ !commentAllowed }
          aria-label={ intl.formatMessage(requestsMessages.commentTitle) }
        >
          { intl.formatMessage(requestsMessages.commentTitle) }
        </Button>
      </CommentLink>
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
