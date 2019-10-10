import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem, Title } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { fetchRbacGroups } from '../../redux/actions/group-actions';
import { WorkflowStageLoader } from '../../presentational-components/shared/loader-placeholders';
import SetStages from './add-stages/set-stages';
import '../../App.scss';

const EditWorkflowStagesModal = ({
  history: { push },
  match: { params: { id }},
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  rbacGroups,
  postMethod,
  isFetching
}) => {
  const [ formData, setValues ] = useState({});

  const handleChange = data => {
    setValues({ ...formData, ...data });
  };

  const initialValues = (wfData) => {
    const stageOptions = wfData.group_refs.map((group, idx) => {
      return { label: (wfData.group_names[idx] ? wfData.group_names[idx] : group), value: group };
    });
    const data = { ...wfData, wfGroups: stageOptions };
    return data;
  };

  useEffect(() => {
    fetchWorkflow(id).then((result) => setValues(initialValues(result.value)));
  }, []);

  const onSave = () => {
    const { wfGroups } = formData;
    const workflowData = { group_refs: wfGroups.map(group => group.value)  };
    updateWorkflow({ id, ...workflowData }).then(postMethod()).then(push('/workflows'));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: `Edit workflow's stages`,
      dismissable: true,
      description: `Edit workflow's stages was cancelled by the user.`
    });
    push('/workflows');
  };

  return (
    <Modal
      title={ `Edit workflow's stages` }
      width={ '40%' }
      isOpen
      onClose={ onCancel }
      onSave={ onSave }>
      <Stack gutter="md">
        <StackItem>
          <FormGroup>
            { isFetching && <WorkflowStageLoader/> }
            { !isFetching && rbacGroups.length === 0 && (
              <Title headingLevel="h2" size="1xl">
                    No groups available.
              </Title>) }
            { !isFetching && rbacGroups.length > 0 && (
              <StackItem className="stages-modal">
                <SetStages className="stages-modal" formData={ formData }
                  handleChange = { handleChange }
                  options={ rbacGroups }
                  title={ `Add or remove ${formData.name}'s stages` }/>
              </StackItem>) }
          </FormGroup>
        </StackItem>
        <StackItem>
          <ActionGroup>
            <Split gutter="md">
              <SplitItem>
                <Button aria-label={ 'Save' }
                  variant="primary"
                  type="submit"
                  isDisabled={ isFetching }
                  onClick={ onSave }>Save</Button>
              </SplitItem>
              <SplitItem>
                <Button  aria-label='Cancel'
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

EditWorkflowStagesModal.defaultProps = {
  rbacGroups: [],
  isFetching: false
};

EditWorkflowStagesModal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  addWorkflow: PropTypes.func.isRequired,
  match: PropTypes.object,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  fetchRbacGroups: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired,
  id: PropTypes.string,
  editType: PropTypes.string,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  isFetching: PropTypes.bool
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflow,
  fetchRbacGroups
}, dispatch);

const mapStateToProps = ({ workflowReducer: { workflow, isRecordLoading }}) => ({
  workflow: workflow.data,
  isFetching: isRecordLoading
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditWorkflowStagesModal));
