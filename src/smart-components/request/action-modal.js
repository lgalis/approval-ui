import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { createRequestAction } from '../../redux/actions/request-actions';
import { createRequestCommentSchema } from '../../forms/request-comment-form.schema';

const ActionModal = ({
  history: { push },
  match: { params: { id }},
  actionType,
  addNotification,
  createRequestAction,
  closeUrl,
  postMethod
}) => {
  const onSubmit = (data) => {
    const operationType = { 'Add Comment': 'memo', Approve: 'approve', Deny: 'deny' };
    const actionName = actionType === 'Add Comment' ? actionType : `${actionType} Request`;
    return postMethod ?
      createRequestAction(
        actionName,
        id,
        { operation: operationType[actionType], ...data }
      ).then(() => postMethod()).then(() => push(closeUrl))
      : createRequestAction(
        actionName,
        id,
        { operation: operationType[actionType], ...data }
      ).then(() => push(closeUrl));
  };

  const onCancel = () => {
    const actionName = actionType === 'Add Comment' ? actionType : `${actionType} Request`;
    addNotification({
      variant: 'warning',
      title: actionName,
      dismissable: true,
      description: `${actionName} was cancelled by the user.`
    });
    push(closeUrl);
  };

  return (
    <Modal
      isLarge
      title={ actionType === 'Add Comment' ? `Request #${id}` : `${actionType} Request #${id}` }
      isOpen
      onClose={ onCancel }
    >
      <FormRenderer
        schema={ createRequestCommentSchema (actionType === 'Deny') }
        schemaType="default"
        onSubmit={ onSubmit }
        onCancel={ onCancel }
        formContainer="modal"
      />
    </Modal>
  );
};

ActionModal.defaultProps = {
  closeUrl: '/requests'
};

ActionModal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  createRequestAction: PropTypes.func.isRequired,
  postMethod: PropTypes.func,
  id: PropTypes.string,
  actionType: PropTypes.string,
  closeUrl: PropTypes.string,
  match: PropTypes.object,
  location: PropTypes.object
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  createRequestAction
}, dispatch);

export default withRouter(connect(null, mapDispatchToProps)(ActionModal));
