import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import FormRenderer from '../common/form-renderer';
import { createWorkflowSchema } from '../../forms/workflow-form.schema';
import { addWorkflow, updateWorkflow, fetchWorkflow, fetchWorkflows } from '../../redux/actions/workflow-actions';
import SummaryContent from './summary_content';

const AddWorkflowModal = ({
  history: { push },
  addWorkflow,
  addNotification,
  fetchWorkflow,
  fetchWorkflows,
  initialValues,
  updateWorkflow,
  initialGroups,
  workflowId,
  rbacGroups
}) => {
  useEffect(() => {
    if (workflowId) {
      fetchWorkflow(workflowId).then(data => setInitialGroups(data));
    }
  }, [ workflowId ]);

  const onSubmit = data => {
    const { name, description, ...wfGroups } = data;
    const workflowData = { name, description, group_refs: Object.values(wfGroups) };
    initialValues
      ? updateWorkflow(workflowData).then(push('/workflosws')).then(() => fetchWorkflows())
      : addWorkflow(workflowData).then(push('/workflows')).then(() => fetchWorkflows());
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: initialValues ? 'Editing workflow' : 'Creating workflow',
      description: initialValues ? 'Edit workflow was cancelled by the user.' : 'Creating workflow was cancelled by the user.'
    });
    push('/workflows');
  };

  const groupOptions = [ ...rbacGroups, { value: undefined, label: 'None' }];
  const Summary = (data) => <SummaryContent values={ data.formOptions.getState().values } groupOptions={ groupOptions } />;

  const setInitialGroups = (workflow) => {
    const initialGroupList = workflow.value.group_refs.map((group, idx) => { return { [`stage-${idx + 1}`]: group };});
    return initialGroupList.reduce((acc, curr) => ({ ...acc, ...curr }), {});
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
          schema={ createWorkflowSchema(!initialValues, groupOptions) }
          schemaType="default"
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          initialValues={ { ...initialValues, ...initialGroups } }
          formFieldsMapper={ {
            ...formFieldsMapper,
            summary: Summary
          } }
          formContainer="modal"
          showFormControls={ false }
          buttonsLabels={ { submitLabel: 'Confirm' } }
        />
      </div>
    </Modal>
  );
};

AddWorkflowModal.defaultProps = {
  rbacGroups: [],
  initialGroups: []
};

AddWorkflowModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  addWorkflow: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  fetchWorkflows: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  updateWorkflow: PropTypes.func.isRequired,
  workflowId: PropTypes.string,
  initialGroups: PropTypes.array,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  let selectedWorkflow = state.workflowReducer.selectedWorkflow;
  return {
    rbacGroups: state.groupReducer.groups,
    initialValues: id && selectedWorkflow,
    workflowId: id
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflows,
  fetchWorkflow
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddWorkflowModal));
