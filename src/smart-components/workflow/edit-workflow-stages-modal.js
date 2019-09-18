import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem, Title } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { fetchRbacGroups } from '../../redux/actions/group-actions';
import '../../App.scss';

const EditWorkflowStagesModal = ({
  history: { push },
  match: { params: { id }},
  editType,
  addNotification,
  updateWorkflow,
  fetchRbacGroups,
  rbacGroups,
  postMethod,
  isFetching
}) => {
  const [ formData, setValues ] = useState({});

  const handleChange = data => {
    setValues({ ...formData, ...data });
  };

  const initialValues = (wfData) => {
    const initialFormValues = { ...wfData };
    if (editType === 'stages') {
      const stageOptions = wfData.group_refs.map((group, idx) => {
        return { label: (wfData.group_names[idx] ? wfData.group_names[idx] : group), value: group };
      });
      initialFormValues.wfGroups = wfData.group_refs;
      initialFormValues.wfStageOptions = stageOptions;
    }

    return initialFormValues;
  };

  useEffect(() => {
    fetchRbacGroups().then((result) => setValues(initialValues(result.value)));
  }, []);

  const onSave = () => {
    const { wfGroups } = formData;
    const workflowData = { group_refs: wfGroups.map(group => group.value)  };
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
      title={ `Edit workflow's information` }
      width={ '40%' }
      isOpen
      onClose={ onCancel }
      onSave={ onSave }>
      <Stack>
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

EditWorkflowStagesModal.defaultProps = {
  rbacGroups: [],
  isFetching: false
};

EditWorkflowStagesModal.propTypes = {
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

const mapStateToProps = ({ workflowReducer: { workflow }, groupReducer: { groups, isLoading }}) => ({
  workflow: workflow.data,
  rbacGroups: groups,
  isFetching: isLoading
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditWorkflowStagesModal));
