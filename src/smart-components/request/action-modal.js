import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../common/form-renderer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchRequests } from '../../redux/actions/request-actions';
import { createRequestCommentSchema } from '../../forms/request-comment-form.schema';

const ActionModal = ({
  history: { push },
  actionType,
  addNotification,
  fetchRequests,
  closeUrl,
  requestId
}) => {
  const onSubmit = () => {
    // TODO - add api call for add comment
    // different action depending on the path
    fetchRequests().then(push(closeUrl));
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
  fetchRequests: PropTypes.func.isRequired,
  requests: PropTypes.object,
  requestId: PropTypes.string,
  actionType: PropTypes.string,
  closeUrl: PropTypes.string,
  match: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  return {
    requests: state.requestReducer.requests,
    requestId: id
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchRequests
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionModal));
