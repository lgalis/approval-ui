import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Title } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { fetchRbacGroups } from '../../redux/actions/group-actions';
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
  workflow,
  rbacGroups,
  postMethod
}) => {

  const groupOptions = [ ...rbacGroups, { value: undefined, label: 'None' }];
  const [ formData, setValues ] = useState({});
  const [ isFetching, setFetching ] = useState(true);

  const handleChange = data => {
    setValues({ ...formData, ...data });
  };

  const initialValues = () => {
    console.log('DEBUG - info initial values: ', workflow);
    let initialFormValues = { ...workflow };

    if (editType === 'stages') {
      let groups = workflow.group_refs.map((group, idx) => {
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
    Promise.all([ fetchWorkflow(id), fetchRbacGroups() ])
    .then(() => { setValues(initialValues()).then(setFetching(false)); })
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
      title={ editType === 'stages' ? 'Edit workflow  stages' : 'Edit workflow information' }
      width={ '50%' }
      isOpen
      onClose={ onCancel }
      onSave={ onSave }>
      <FormGroup>
        { isFetching && <WorkflowStageLoader/> }
        { !isFetching && rbacGroups.length === 0 && (
          <Title headingLevel="h2" size="1xl">
                No groups available.
          </Title>) }
        { !isFetching && rbacGroups.length > 0 && editType === 'stages' && (
          <SetStages formData={ initialValues() } handleChange = { handleChange } options={ groupOptions } />) }
        { !isFetching && editType !== 'stages' && (
          <StageInformation initialValues={ initialValues() } formData = { formData } handleChange = { handleChange } />) }
      </FormGroup>
      <ActionGroup>
        <Button aria-label={ 'Save' }
          variant="primary"
          type="submit"
          onClick={ onSave }>Save</Button>
        <Button  aria-label='Cancel'
          variant='secondary'
          type='button'
          onClick={ onCancel }>Cancel</Button>
      </ActionGroup>
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
  fetchRbacGroups: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  updateWorkflow: PropTypes.func.isRequired,
  id: PropTypes.string,
  workflow: PropTypes.object,
  editType: PropTypes.string,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

const mapStateToProps = ({ workflowReducer: { workflow }, groupReducer: { groups }}) => ({
  workflow,
  rbacGroups: groups
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchRbacGroups,
  fetchWorkflow
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditWorkflowModal));
