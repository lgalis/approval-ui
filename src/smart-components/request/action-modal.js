import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { createStageAction, fetchRequest } from '../../redux/actions/request-actions';
import { createRequestCommentSchema } from '../../forms/request-comment-form.schema';

const ActionModal = ({
  history: { push },
  match: { params: { id }},
  actionType,
  addNotification,
  createStageAction,
  closeUrl,
  postMethod
}) => {
  const [ selectedRequest, setSelectedRequest ] = useState({});

  const fetchData = (setRequestData) => {
    fetchRequest(id).payload.then((data) => setRequestData(data)).catch(() => setRequestData(undefined));
  };

  useEffect(() => {
    fetchData(setSelectedRequest);
  }, []);

  const onSubmit = async (data) => {
    const operationType = { 'Add Comment': 'memo', Approve: 'approve', Deny: 'deny' };
    const activeStage =  selectedRequest.stages[selectedRequest.active_stage - 1];
    const actionName = actionType === 'Add Comment' ? actionType : `${actionType} Request`;
    if (activeStage) {
      createStageAction(actionName, activeStage.id,
        { operation: operationType[actionType], processed_by: 'User', ...data }).
      then(postMethod ? postMethod().then(push(closeUrl)) : push(closeUrl));
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
  closeUrl: '/requests',
  fetchData: true
};

ActionModal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchData: PropTypes.bool,
  createStageAction: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func,
  postMethod: PropTypes.func,
  selectedRequest: PropTypes.object,
  id: PropTypes.string,
  actionType: PropTypes.string,
  closeUrl: PropTypes.string,
  match: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = ({ requestReducer: { isRequestDataLoading }}) => ({
  isLoading: isRequestDataLoading
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchRequest,
  createStageAction
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionModal));
