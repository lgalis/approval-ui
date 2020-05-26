import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { createRequestAction } from '../../redux/actions/request-actions';
import { createRequestCommentSchema } from '../../forms/request-comment-form.schema';
import useQuery from '../../utilities/use-query';
import routes from '../../constants/routes';

const ActionModal = ({
  actionType,
  addNotification,
  createRequestAction,
  closeUrl,
  postMethod
}) => {
  const { push } = useHistory();
  const [{ request: id }] = useQuery([ 'request' ]);

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
        schema={ createRequestCommentSchema(actionType === 'Deny') }
        onSubmit={ onSubmit }
        onCancel={ onCancel }
        formContainer="modal"
      />
    </Modal>
  );
};

ActionModal.defaultProps = {
  closeUrl: routes.requests.index
};

ActionModal.propTypes = {
  addNotification: PropTypes.func.isRequired,
  createRequestAction: PropTypes.func.isRequired,
  postMethod: PropTypes.func,
  actionType: PropTypes.string,
  closeUrl: PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({ patname: PropTypes.string, search: PropTypes.string }) ])
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  createRequestAction
}, dispatch);

export default connect(null, mapDispatchToProps)(ActionModal);
