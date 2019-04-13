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

const DenyRequestModal = ({
  history: { push },
  addNotification,
  fetchRequests,
  requestId
}) => {
  const onSubmit = () => {
    //TODO - add api for deny request
    fetchRequests().then(push('/requests'));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: 'Deny request',
      description: 'Deny request was cancelled by the user.'
    });
    push('/requests');
  };

  return (
    <Modal
      isLarge
      title={ `Deny Request #${requestId}` }
      isOpen
      onClose={ onCancel }
    >
      <FormRenderer
        schema={ createRequestCommentSchema('Reason', true) }
        schemaType="default"
        onSubmit={ onSubmit }
        onCancel={ onCancel }
        formContainer="modal"
      />
    </Modal>
  );
};

DenyRequestModal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchRequests: PropTypes.func.isRequired,
  requests: PropTypes.array,
  requestId: PropTypes.string
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DenyRequestModal));
