import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { ActionGroup, Button, FormGroup, Modal, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import SetGroups from './add-groups/set-groups';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';

import '../../App.scss';

const EditWorkflowGroupsModal = ({
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  postMethod,
  isFetching
}) => {
  const [ formData, setValues ] = useState({});

  const { push } = useHistory();
  const [{ workflow: id }] = useQuery([ 'workflow' ]);
  const loadedWorkflow = useWorkflow(id);

  const handleChange = data => {
    setValues({ ...formData, ...data });
  };

  const initialValues = (wfData) => {
    const groupOptions = wfData.group_refs.map((group) => {
      return { label: group.name, value: group.uuid };
    });
    const data = { ...wfData, wfGroups: groupOptions };
    return data;
  };

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id).then((result) => setValues(initialValues(result.value)));
    } else {
      setValues(initialValues(loadedWorkflow));
    }
  }, []);

  const onSave = () => {
    const { wfGroups } = formData;
    const workflowData = { group_refs: wfGroups ? wfGroups.map(group => ({ name: group.label, uuid: group.value })) : []};
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
          <FormGroup fieldId="workflow-groups-formgroup">
            { isFetching && <WorkflowInfoFormLoader/> }
            { !isFetching && (
              <StackItem className="groups-modal">
                <SetGroups className="groups-modal" formData={ formData }
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

EditWorkflowGroupsModal.defaultProps = {
  isFetching: false
};

EditWorkflowGroupsModal.propTypes = {
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired,
  isFetching: PropTypes.bool
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflow
}, dispatch);

const mapStateToProps = ({ workflowReducer: { isRecordLoading }}) => ({
  isFetching: isRecordLoading
});

export default connect(mapStateToProps, mapDispatchToProps)(EditWorkflowGroupsModal);
