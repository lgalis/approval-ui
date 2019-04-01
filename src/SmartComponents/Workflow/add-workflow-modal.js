import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';

import FormRenderer from '../common/form-renderer';
import { fetchWorkflows } from '../../redux/actions/approval-actions';
import { createWorkflowSchema } from '../../forms/workflow-form.schema';
import { addWorkflow, updateWorkflow } from '../../redux/Actions/WorkflowActions';

const AddWorkflowModal = ({
  history: { goBack },
  addWorkflow,
  addNotification,
  fetchWorkflows,
  initialValues,
  updateWorkflow,
  fetchRbacGroups,
  rbacGroups
}) => {
  useEffect(() => {
    fetchWorkflows();
  }, []);
  const onSubmit = data => initialValues
    ? updateWorkflow(data).then(goBack).then(() => fetchWorkflows())
    : addWorkflow(data).then(goBack).then(() => fetchWorkflows());

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: initialValues ? 'Editing workflow' : 'Creating workflow',
      description: initialValues ? 'Edit workflow was cancelled by the user.' : 'Creating workflow was cancelled by the user.'
    });
    goBack();
  };

  return (
    <Modal
      title={ initialValues ? 'Edit workflow' : 'Create workflow' }
      isOpen
      onClose={ onCancel }
      isSmall
    >
      <div style={ { padding: 8 } }>
        <FormRenderer
          schema={ createWorkflowSchema(!initialValues, rbacGroups) }
          schemaType="default"
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          initialValues={ { ...initialValues } }
          formContainer="modal"
          buttonsLabels={ { submitLabel: 'Confirm' } }
        />
      </div>
    </Modal>
  );
};

AddWorkflowModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  addNotification: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  fetchWorkflows: PropTypes.func.isRequired,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

const mapStateToProps = ({ rbacReducer: { rbacGroups }, workflowReducer: { workflows }}, { match: { params: { id }}}) => ({
  initialValues: id && workflows.find(item => item.id === id),
  workflowId: id,
  rbacGroups
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflows,
  fetchRbacGroups
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddWorkflowModal));
