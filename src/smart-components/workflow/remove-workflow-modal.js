import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Title, Bullseye } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { fetchWorkflows, removeWorkflow } from '../../redux/actions/workflow-actions';
import './workflow.scss';

const RemoveWorkflowModal = ({
  history: { goBack, push },
  removeWorkflow,
  addNotification,
  fetchWorkflows,
  workflowId,
  workflowName
}) => {
  const onSubmit = () => removeWorkflow(workflowId)
  .then(() => {
    fetchWorkflows();
    push('/workflows');
  });

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: 'Removing workflow',
      description: 'Removing workflow was cancelled by the user.'
    });
    goBack();
  };

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
            Removing Workflow:  { workflowName }
          </Title>
        </div>
      </Bullseye>
    </Modal>
  );
};

RemoveWorkflowModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  removeWorkflow: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflows: PropTypes.func.isRequired,
  workflowId: PropTypes.string,
  workflowName: PropTypes.string
};

const workflowDetailsFromState = (state, id) =>
  state.workflowReducer.workflows.find(workflow => workflow.id  === id);

const mapStateToProps = (state, { match: { params: { id }}}) => {
  let workflow = workflowDetailsFromState(state, id);
  return {
    workflowId: workflow.id,
    workflowName: workflow.name
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  fetchWorkflows,
  removeWorkflow
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemoveWorkflowModal));
