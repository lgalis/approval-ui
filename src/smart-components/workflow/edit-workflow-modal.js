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
import StageInformation from './add-stages/stage-information';
import '../../App.scss';

const EditWorkflowModal = ({
  history: { push },
  match: { params: { id }},
  editType,
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  fetchRbacGroups,
  rbacGroups,
  postMethod
}) => {
  //const rbacGroups = useSelector(state => (state.groupReducer ? state.groupReducer.groups : {}));
  const [ formData, setValues ] = useState({});
  const [ isFetching, setFetching ] = useState(true);

  const handleChange = data => {
    setValues({ ...formData, ...data });
  };

  const initialValues = (wfData) => {
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
      initialFormValues.wfGroups = groups;
    }

    return initialFormValues;
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      const groups = await fetchRbacGroups();
      rbacGroups = groups.value;
      const result = await fetchWorkflow(id);
      setValues(initialValues(result.value));
      setFetching(false);
    };

    fetchData();
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
              <StackItem className="stages-modal">
                <SetStages className="stages-modal" formData={ formData }
                  handleChange = { handleChange }
                  options={ rbacGroups }
                  title={ `Add or remove ${formData.name}'s stages` }/>
              </StackItem>) }
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
  fetchRbacGroups: PropTypes.func.isRequired,
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
  fetchWorkflow,
  fetchRbacGroups
}, dispatch);

const mapStateToProps = ({ workflowReducer: { workflow }, groupReducer: { groups }}) => ({
  workflow: workflow.data,
  rbacGroups: groups
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditWorkflowModal));
