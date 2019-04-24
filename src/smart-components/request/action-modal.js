import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchRequest, createStageAction, fetchRequests } from '../../redux/actions/request-actions';
import { createRequestCommentSchema } from '../../forms/request-comment-form.schema';

const ActionModal = ({
  history: { push },
  actionType,
  addNotification,
  fetchRequests,
  fetchRequest,
  createStageAction,
  selectedRequest,
  closeUrl,
  requestId
}) => {
  useEffect(() => {
    if (requestId) {
      fetchRequest(requestId);
    }
  }, [ requestId ]);

  const onSubmit = async (data) => {
    const operationType = { 'Add Comment': 'memo', Approve: 'approve', Deny: 'deny' };
    const activeStage =  selectedRequest.stages[selectedRequest.active_stage - 1];
    const actionName = actionType === 'Add Comment' ? actionType : `${actionType} Request`;
    if (activeStage) {
      createStageAction(activeStage.id, { actionName, operation: operationType[actionType], processed_by: 'User', ...data }).then(fetchRequests()).then(push(closeUrl));
    }
  };

  const onCancel = () => {
    const actionName = actionType === 'Add Comment' ? actionType : `${actionType} Request`;
    addNotification({
      variant: 'warning',
      title: actionName,
      description: `${actionName} was cancelled by the user.`
    });
    push(closeUrl);
  };

  return (
    <Modal
      isLarge
      title={ actionType === 'Add Comment' ? `Request #${requestId}` : `${actionType} Request #${requestId}` }
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
  fetchRequest: PropTypes.func.isRequired,
  fetchRequests: PropTypes.func.isRequired,
  createStageAction: PropTypes.func.isRequired,
  requests: PropTypes.object,
  selectedRequest: PropTypes.object,
  requestId: PropTypes.string,
  actionType: PropTypes.string,
  closeUrl: PropTypes.string,
  match: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  return {
    requests: state.requestReducer.requests,
    selectedRequest: state.requestReducer.selectedRequest,
    requestId: id
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchRequests,
  createStageAction,
  fetchRequest
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionModal));
