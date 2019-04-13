import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Bullseye, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { fetchRequests, fetchRequest, removeRequest } from '../../redux/actions/request-actions';

const RemoveRequestModal = ({
  history: { goBack, push },
  removeRequest,
  fetchRequests,
  fetchRequest,
  requestId,
  request
}) => {
  useEffect(() => {
    if (requestId) {
      fetchRequest(requestId);
    }
  }, []);

  if (!request) {
    return null;
  }

  const onSubmit = () => removeRequest(requestId)
  .then(() => {
    fetchRequests();
    push('/requests');
  });

  const onCancel = () => goBack();

  return (
    <Modal
      isOpen
      isSmall
      title = { '' }
      onClose={ onCancel }
      actions={ [
        <Button key="cancel" variant="secondary" type="button" onClick={ onCancel }>
          Cancel
        </Button>,
        <Button key="submit" variant="primary" type="button" onClick={ onSubmit }>
          Confirm
        </Button>
      ] }
    >
      <Bullseye>
        <TextContent>
          <Text component={ TextVariants.h1 }>
            Removing Request:  { request.name }
          </Text>
        </TextContent>
      </Bullseye>
    </Modal>
  );
};

RemoveRequestModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  removeRequest: PropTypes.func.isRequired,
  fetchRequests: PropTypes.func.isRequired,
  fetchRequest: PropTypes.func.isRequired,
  requestId: PropTypes.string,
  request: PropTypes.object
};

const mapStateToProps = ({ requestReducer: { selectedRequest, isLoading }},
  { match: { params: { id }}}) => ({
  requestId: id,
  request: selectedRequest,
  isLoading
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchRequest,
  fetchRequests,
  removeRequest
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemoveRequestModal));
