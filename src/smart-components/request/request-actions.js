import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Button } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import requestsMessages from '../../messages/requests.messages';
import { isRequestStateActive } from '../../helpers/shared/helpers';

const JustChildren = ({ children }) => <React.Fragment>{ children }</React.Fragment>;

JustChildren.propTypes = {
  children: PropTypes.node
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

  const { id, state, number_of_children } = request;
  const approveDenyAllowed = isRequestStateActive(state) && canApproveDeny;
  const commentAllowed = canComment;

  const ApproveDenyLink = approveDenyAllowed ? Link : JustChildren;
  const CommentLink = approveDenyAllowed ? Link : JustChildren;

  return (
    <div style={ { display: 'flex' } }>
      <ApproveDenyLink to={ { pathname: approveLink, search: `request=${id}` } } className="pf-u-mr-sm">
        <Button
          variant="primary"
          aria-label={ intl.formatMessage(requestsMessages.approveRequest) }
          isDisabled={ !approveDenyAllowed }
        >
          { intl.formatMessage(requestsMessages.approveTitle) }
        </Button>
      </ApproveDenyLink>
      <ApproveDenyLink to={ { pathname: denyLink, search: `request=${id}` } } className="pf-u-mr-sm">
        <Button
          variant="danger"
          isDisabled={ !commentAllowed }
          aria-label={ intl.formatMessage(requestsMessages.denyTitle) }
        >
          { intl.formatMessage(requestsMessages.denyTitle) }
        </Button>
      </ApproveDenyLink>
      <CommentLink to={ { pathname: commentLink, search: `request=${id}` } }>
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
