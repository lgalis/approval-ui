import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import WorkflowInfoForm from './add-stages/stage-information';
import WorkflowSequenceForm from './add-stages/workflow-sequence';
import '../../App.scss';

const EditWorkflowInfoModal = ({
  history: { push },
  match: { params: { id }},
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  postMethod,
  workflow,
  isFetching,
  editType
}) => {
  const [ formData, setFormData ] = useState({});
  const [ initialValue, setInitialValue ] = useState({});
  const [ isValid, setIsValid ] = useState(true);

  const handleChange = data => setFormData({ ...formData, ...data });

  useEffect(() => {
    fetchWorkflow(id).then((data) => { setFormData({ ...formData, ...data.value }); setInitialValue({ ...data.value });});
  }, []);

  const onSave = () => {
    if (!isValid) {return;}

    const { name, description, sequence } = formData;
    const workflowData = { id, name, description, sequence };
    updateWorkflow(workflowData).then(() => postMethod()).then(() => push('/workflows'));
  };

  const onCancel = () => {
    const { title, description } =
        editType === 'sequence' ? { title: `Edit approval process's sequence`,
          description: `Edit approval process's sequence was cancelled by the user.` } :
          { title: `Edit approval process's information`,
            description: `Edit approval process's information was cancelled by the user.` };
    addNotification({
      variant: 'warning',
      title,
      dismissable: true,
      description
    });
    push('/workflows');
  };

  return (
    <Modal
      title={ editType === 'sequence' ? 'Edit sequence' : 'Edit information' }
      width={ '40%' }
      isOpen
      onClose={ onCancel }>
      <Stack gutter="md">
        <StackItem>
          <FormGroup fieldId="edit-workflow-info-modal-info">
            { isFetching && <WorkflowInfoFormLoader/> }
            { !isFetching && (editType === 'info' ?
              <WorkflowInfoForm formData={ formData } initialValue={ initialValue }
                handleChange={ handleChange }
                isValid={ isValid }
                setIsValid={ setIsValid }
                title={ `Make any changes to approval process ${workflow.name}` }/> :
              <WorkflowSequenceForm formData={ formData }
                initialValue={ initialValue }
                handleChange={ handleChange }
                isValid={ isValid }
                setIsValid={ setIsValid }
                title={ `Set the sequence for the approval process ${workflow.name}` }/>
            ) }
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
  isFetching: false,
  editType: 'info'
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
