import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FormRenderer from '../Common/FormRenderer';
import { Modal, Grid, GridItem } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { addWorkflow, fetchWorkflows, updateWorkflow } from '../../redux/Actions/WorkflowActions';
import { pipe } from 'rxjs';

const AddWorkflowModal = ({
  history: { goBack },
  addWorkflow,
  addNotification,
  fetchWorkflows,
  initialValues,
  updateWorkflow
}) => {
  const onSubmit = data => {
    const request_data = { ...data, request_list: selectedRequests.map(request => ({ requestname: request })) };
    initialValues
      ? updateWorkflow(request_data).then(() => fetchWorkflows()).then(goBack)
      : addWorkflow(request_data).then(() => fetchWorkflows()).then(goBack);
  };

  const onCancel = () => pipe(
    addNotification({
      variant: 'warning',
      title: initialValues ? 'Editing workflow' : 'Creating workflow',
      description: initialValues ? 'Edit workflow was cancelled by the user.' : 'Creating workflow was cancelled by the user.'
    }),
    goBack()
  );

  let selectedRequests = [];

  const schema = {
    type: 'object',
    properties: {
      name: { title: initialValues ? 'Workflow Name' : 'New Workflow Name', type: 'string' },
      description: { title: 'Description', type: 'string' }
    },
    required: [ 'name' ]
  };

  return (
    <Modal
      isLarge
      title={ initialValues ? 'Edit workflow' : 'Create workflow' }
      isOpen
      onClose={ onCancel }
    >
      <Grid gutter="md" style={ { minWidth: '800px' } }>
        <GridItem sm={ 6 }>
          <FormRenderer
            schema={ schema }
            schemaType="mozilla"
            onSubmit={ onSubmit }
            onCancel={ onCancel }
            formContainer="modal"
            initialValues={ { ...initialValues } }
          />
        </GridItem>
      </Grid>
    </Modal>
  );
};

AddWorkflowModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  addWorkflow: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflows: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  updateWorkflow: PropTypes.func.isRequired
};

const mapStateToProps = (state, { match: { params: { id }}}) => {
  let workflows = state.workflowReducer.workflows;
  return {
    initialValues: id && workflows.find(item => item.id === id),
    workflowId: id
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflows
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddWorkflowModal));
