import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem, Title } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowStageLoader } from '../../presentational-components/shared/loader-placeholders';
import SetStages from './add-stages/set-stages';
import StageInformation from './add-stages/stage-information';

const EditWorkflowModal = ({
  history: { push },
  match: { params: { id }},
  editType,
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  postMethod
}) => {
  const rbacGroups = useSelector(state => (state.groupReducer ? state.groupReducer.groups : {}));
  const groupOptions = [ ...rbacGroups, { value: undefined, label: 'None' }];
  const [ formData, setValues ] = useState({});
  const [ isFetching, setFetching ] = useState(true);

  const handleChange = data => {
    setValues({ ...formData, ...data });
  };

  const initialValues = (wfData) => {
    console.log('DEBUG - info initial values: ', wfData);
    let initialFormValues = { ...wfData };

    if (editType === 'stages') {
      let groups = wfData.group_refs.map((group, idx) => {
        if (rbacGroups.find(rbacGroup => rbacGroup.value === group)) {
          return group;
        }
        else {
          addNotification({
            variant: 'warning',
            title: `Edit workflow's information`,
            description: `Stage ${idx + 1} group with id: ${group} no longer accessible`
          });
        }
      });
      console.log('DEBUG - stages initial values: ', groups);
      initialFormValues.wfGroups = groups;
    }

    return initialFormValues;
  };

  useEffect(() => {
    setFetching(true);
    fetchWorkflow(id)
    .then((data) => { setValues(initialValues(data.value)).then(setFetching(false)); })
    .catch(() => setFetching(false));
  }, []);

  const onSave = () => {
    const { name, description, wfGroups } = formData;
    const workflowData = (editType === 'stages') ? { group_refs: wfGroups.slice() } : { name, description };
    updateWorkflow({ id, ...workflowData }).then(postMethod ? postMethod().then(push('/workflows')) : push('/workflows'));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: `Edit workflow's ${editType}`,
      description: `Edit workflow's ${editType} was cancelled by the user.`
    });
    postMethod ? postMethod().then(push('/workflows')) : push('/workflows');
  };

  return (
    <Modal
      title={ editType === 'stages' ? `Edit workflow's stages` : `Edit workflow's information` }
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
            { !isFetching && rbacGroups.length > 0 && editType === 'stages' && (
              <SetStages formData={ formData }
                handleChange = { handleChange }
                options={ groupOptions }
                title={ `Add or remove ${formData.name}'s stages` }/>) }
            { !isFetching && editType !== 'stages' && (
              <StageInformation formData = { formData }
                handleChange = { handleChange }
                title = { `Make any changes to workflow ${formData.name}` }/>) }
          </FormGroup>
        </StackItem>
        <StackItem>
          <ActionGroup>
            <Split gutter="md">
              <SplitItem>
                <Button aria-label={ 'Save' }
                  variant="primary"
                  type="submit"
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

EditWorkflowModal.defaultProps = {
  rbacGroups: []
};

EditWorkflowModal.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  addWorkflow: PropTypes.func.isRequired,
  match: PropTypes.object,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired,
  id: PropTypes.string,
  editType: PropTypes.string,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflow
}, dispatch);

export default withRouter(connect(null, mapDispatchToProps)(EditWorkflowModal));
