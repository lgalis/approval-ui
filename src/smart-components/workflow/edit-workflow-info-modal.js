import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import WorkflowInfoForm from './add-groups/workflow-information';
import WorkflowSequenceForm from './add-groups/workflow-sequence';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';

const EditWorkflowInfoModal = ({
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

  const { push } = useHistory();
  const [{ workflow: id }] = useQuery([ 'workflow' ]);
  const loadedWorkflow = useWorkflow(id);

  const handleChange = data => setFormData({ ...formData, ...data });

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id).then((data) => { setFormData({ ...formData, ...data.value }); setInitialValue({ ...data.value });});
    } else {
      setFormData({ ...formData, ...loadedWorkflow });
    }
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

  const name = loadedWorkflow ? loadedWorkflow.name : workflow && workflow.name;

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
                setIsValid={ setIsValid }
                title={ `Make any changes to approval process ${name}` }/> :
              <WorkflowSequenceForm formData={ formData }
                initialValue={ initialValue }
                handleChange={ handleChange }
                isValid={ isValid }
                setIsValid={ setIsValid }
                title={ `Set the sequence for the approval process ${name}` }/>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditWorkflowInfoModal);
