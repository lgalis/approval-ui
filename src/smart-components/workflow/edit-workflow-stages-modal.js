import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { fetchRbacGroups } from '../../redux/actions/group-actions';
import { WorkflowFormLoader } from '../../presentational-components/shared/loader-placeholders';
import SetStages from './add-stages/set-stages';
import '../../App.scss';

const EditWorkflowStagesModal = ({
  history: { push },
  match: { params: { id }},
  addNotification,
  fetchWorkflow,
  updateWorkflow,
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
    updateWorkflow({ id, ...workflowData }).then(() => postMethod()).then(()=>push('/workflows'));
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
      title={ `Edit approval process's groups` }
      width={ '40%' }
      isOpen
      onClose={ onCancel }>
      <Stack gutter="md">
        <StackItem>
          <FormGroup fieldId="workflow-stages-formgroup">
            { isFetching && <WorkflowFormLoader/> }
            { !isFetching && (
              <StackItem className="stages-modal">
                <SetStages className="stages-modal" formData={ formData }
                  handleChange={ handleChange }
                  title={ `Add or remove ${formData.name}'s groups` }/>
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
  isFetching: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflow,
  fetchRbacGroups
}, dispatch);

const mapStateToProps = ({ workflowReducer: { isRecordLoading }}) => ({
  isFetching: isRecordLoading
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditWorkflowStagesModal));
