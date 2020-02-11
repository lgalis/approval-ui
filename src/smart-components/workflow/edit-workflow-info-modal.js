import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowStageLoader } from '../../presentational-components/shared/loader-placeholders';
import StageInformation from './add-stages/stage-information';
import '../../App.scss';

const EditWorkflowInfoModal = ({
  history: { push },
  match: { params: { id }},
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  postMethod,
  workflow,
  isFetching
}) => {
  const [ formData, setFormData ] = useState({});

  const handleChange = data => setFormData({ ...formData, ...data });

  useEffect(() => {
    fetchWorkflow(id).then((data) => setFormData({ ...formData, ...data.value }));
  }, []);

  const onSave = () => {
    const { name, description } = formData;
    const workflowData = { id, name, description };
    updateWorkflow(workflowData).then(() => postMethod()).then(() => push('/workflows'));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: `Edit approval process's groups`,
      dismissable: true,
      description: `Edit approval process's groups was cancelled by the user.`
    });
    push('/workflows');
  };

  return (
    <Modal
      title={ `Edit approval process's information` }
      width={ '40%' }
      isOpen
      onClose={ onCancel }>
      <Stack gutter="md">
        <StackItem>
          <FormGroup fieldId="edito-workflow-info-modal-info">
            { isFetching && <WorkflowStageLoader/> }
            { !isFetching && (
              <StageInformation formData={ formData }
                handleChange={ handleChange }
                title={ `Make any changes to approval process ${workflow.name}` }/>) }
          </FormGroup>
        </StackItem>
        <StackItem>
          <ActionGroup>
            <Split gutter="md">
              <SplitItem>
                <Button
                  aria-label={ 'Save' }
                  id="save-edit-workflow-info"
                  variant="primary"
                  type="submit"
                  isDisabled={ isFetching }
                  onClick={ onSave }>Save</Button>
              </SplitItem>
              <SplitItem>
                <Button
                  id="cancel-edit-workflow-info"
                  aria-label='Cancel'
                  variant='secondary'
                  type='button'
                  onClick={ onCancel }>Cancel</Button>
              </SplitItem>
            </Split>
          </ActionGroup>
        </StackItem>
      </Stack>
    </Modal>
  );
};

EditWorkflowInfoModal.defaultProps = {
  isFetching: false
};

EditWorkflowInfoModal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.object,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired,
  workflow: PropTypes.object,
  id: PropTypes.string,
  editType: PropTypes.string,
  isFetching: PropTypes.bool
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflow
}, dispatch);

const mapStateToProps = ({ workflowReducer: { workflow, isRecordLoading }}) => ({
  workflow,
  isFetching: isRecordLoading
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditWorkflowInfoModal));
