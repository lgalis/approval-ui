import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { createRequestAction } from '../../redux/actions/request-actions';
import { createRequestCommentSchema } from '../../forms/request-comment-form.schema';
import useQuery from '../../utilities/use-query';
import routes from '../../constants/routes';
import { useIntl } from 'react-intl';
import actionModalMessages from '../../messages/action-modal.messages';
import requestsMessages from '../../messages/requests.messages';

const actionTypeToMsg = {
  Approve: requestsMessages.approveTitle,
  Deny: requestsMessages.denyTitle
};

const ActionModal = ({
  actionType,
  createRequestAction,
  closeUrl,
  postMethod,
  postMethohdParameter
}) => {
  const intl = useIntl();
  const { push } = useHistory();
  const [{ request: id }] = useQuery([ 'request' ]);
  const onSubmit = (data) => {
    const operationType = { 'Add Comment': 'memo', Approve: 'approve', Deny: 'deny' };
    const actionName = actionType === 'Add Comment'
      ? intl.formatMessage(requestsMessages.addCommentTitle)
      : intl.formatMessage(actionModalMessages.actionName, { actionType: intl.formatMessage(actionTypeToMsg[actionType]) }) ;

    return postMethod ?
      createRequestAction(
        actionName,
        id,
        { operation: operationType[actionType], ...data },
        intl
      ).then(() => postMethod(postMethohdParameter)).then(() => push(closeUrl))
      : createRequestAction(
        actionName,
        id,
        { operation: operationType[actionType], ...data },
        intl
      ).then(() => push(closeUrl));
  };

  const onCancel = () => push(closeUrl);

  return (
    <Modal
      variant="large"
      title={ actionType === 'Add Comment'
        ? intl.formatMessage(actionModalMessages.requestTitle, { id })
        : intl.formatMessage(actionModalMessages.requestActionTitle, { id, actionType: intl.formatMessage(actionTypeToMsg[actionType]) })
      }
      isOpen
      onClose={ onCancel }
    >
      <FormRenderer
        schema={ createRequestCommentSchema(actionType === 'Deny', intl) }
        onSubmit={ onSubmit }
        onCancel={ onCancel }
      />
    </Modal>
  );
};

ActionModal.defaultProps = {
  closeUrl: routes.requests.index
};

ActionModal.propTypes = {
  createRequestAction: PropTypes.func.isRequired,
  postMethod: PropTypes.func,
  actionType: PropTypes.string,
  postMethohdParameter: PropTypes.string,
  closeUrl: PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({ patname: PropTypes.string, search: PropTypes.string }) ])
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createRequestAction
}, dispatch);

export default connect(null, mapDispatchToProps)(ActionModal);
