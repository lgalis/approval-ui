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

  const setRequestData = (requestData) => {
    setSelectedRequest(requestData);
  };

  const fetchData = () => {
    fetchRequest(id).payload.then((data) => setRequestData(data)).catch(() => setRequestData(undefined));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const operationType = { 'Add Comment': 'memo', Approve: 'approve', Deny: 'deny' };
    const activeStage =  selectedRequest.stages[selectedRequest.active_stage - 1];
    const actionName = actionType === 'Add Comment' ? actionType : `${actionType} Request`;
    if (activeStage) {
      return postMethod ? createStageAction(actionName, activeStage.id,
        { operation: operationType[actionType], ...data }).then(() => postMethod()).then(() => push(closeUrl)) :
        createStageAction(actionName, activeStage.id,
          { operation: operationType[actionType], ...data }).then(() => push(closeUrl));
    }
    else {
      const actionName = actionType === 'Add Comment' ? actionType : `${actionType} Request`;
      addNotification({
        variant: 'warning',
        title: actionName,
        dismissable: true,
        description: `${actionName} - no active stage.`
      });
      push(closeUrl);
    }
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
