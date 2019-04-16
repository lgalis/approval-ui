import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Bullseye, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { fetchWorkflows, fetchWorkflow, removeWorkflow } from '../../redux/actions/workflow-actions';

const RemoveWorkflowModal = ({
  history: { goBack, push },
  removeWorkflow,
  fetchWorkflows,
  fetchWorkflow,
  workflowId,
  workflow
}) => {
  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId);
    }
  }, [ workflowId ]);

  if (!workflow) {
    return null;
  }

  const onSubmit = () => removeWorkflow(workflowId)
  .then(() => {
    fetchWorkflows();
    push('/workflows');
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
            Removing Workflow:  { workflow.name }
          </Text>
        </TextContent>
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
  fetchWorkflows: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  workflowId: PropTypes.string,
  workflow: PropTypes.object
};

const mapStateToProps = ({ workflowReducer: { selectedWorkflow, isLoading }},
  { match: { params: { id }}}) => ({
  workflowId: id,
  workflow: selectedWorkflow,
  isLoading
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchWorkflow,
  fetchWorkflows,
  removeWorkflow
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemoveWorkflowModal));
