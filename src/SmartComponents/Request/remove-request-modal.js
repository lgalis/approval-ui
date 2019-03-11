import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Title, Bullseye } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchRequests, removeRequest } from '../../redux/Actions/RequestActions';
import { pipe } from 'rxjs';
import './request.scss';

const RemoveRequestModal = ({
  history: { goBack, push },
  removeRequest,
  addNotification,
  fetchRequests,
  requestId,
  requestEmail
}) => {
  const onSubmit = () => removeRequest(requestId)
  .then(() => pipe(fetchRequests(), push('/requests')));

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: 'Removing request',
      description: 'Removing request was cancelled by the request.'
    }),
    goBack()
  );

  return (
    <Modal
      isOpen
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
        <div className="center_message">
          <Title size={ 'xl' }>
            Removing Request:  { requestEmail }
          </Title>
        </div>
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
  addNotification: PropTypes.func.isRequired,
  fetchRequests: PropTypes.func.isRequired,
  requestId: PropTypes.string,
  requestEmail: PropTypes.string
};

const requestDetailsFromState = (state, id) =>
  state.requestReducer.requests.find(request => request.id  === id);

const mapStateToProps = (state, { match: { params: { id }}}) => {
  let request = requestDetailsFromState(state, id);
  return {
    requestId: request.id,
    requestEmail: request.email
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchRequests,
  removeRequest
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemoveRequestModal));
