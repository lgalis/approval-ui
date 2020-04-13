import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Wizard } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow } from '../../../redux/actions/workflow-actions';
import SummaryContent from './summary-content';
import WorkflowInfoForm from './workflow-information';
import SetGroups from './set-groups';

const AddWorkflow = () => {
  const [ formData, setValues ] = useState({ wfGroups: []});
  const dispatch = useDispatch();
  const { push } = useHistory();

  const rbacGroups = useSelector(({ groupReducer: { groups }}) => groups);
  const [ isValid, setIsValid ] = useState(formData.name !== undefined && formData.name.length > 0);
  const [ stepIdReached, setStepIdReached ] = useState(1);

  const handleChange = data => {
    setValues({ ...formData,  ...data });
  };

  const onNext = ({ id }) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
  };

  const steps = [
    { id: 1,
      name: 'General information',
      enableNext: isValid && formData.name && formData.name.length > 0,
      component: <WorkflowInfoForm formData={ formData }
        handleChange={ handleChange }
        isValid={ isValid } setIsValid={ setIsValid }/> },
    { id: 2,
      name: 'Set groups',
      canJumpTo: stepIdReached >= 2,
      component: <SetGroups formData={ formData }
        handleChange={ handleChange } options={ rbacGroups } /> },
    { id: 3,
      canJumpTo: stepIdReached >= 3,
      name: 'Review', component: <SummaryContent formData={ formData }
        options={ rbacGroups } />, nextButtonText: 'Confirm' }
  ];

  const onSave = () => {
    const { name, description, wfGroups } = formData;
    const workflowData = { name, description,
      group_refs: wfGroups && wfGroups.length > 0 ? wfGroups.map(group => ({ name: group.label, uuid: group.value })) : []};
    push('/workflows');
    dispatch(addWorkflow(workflowData));
  };

  const onCancel = () => {
    dispatch(addNotification({
      variant: 'warning',
      title: 'Creating approval process',
      dismissable: true,
      description: 'Creating approval process was cancelled by the user.'
    }));
    push('/workflows');
  };

  return (
    <Wizard
      title={ 'Create approval process' }
      isOpen
      onClose={ onCancel }
      onSave={ onSave  }
      onNext={  onNext }
      steps={ steps }
    />
  );
};

AddWorkflow.defaultProps = {
  rbacGroups: [],
  initialValues: {}
};

AddWorkflow.propTypes = {
  addWorkflow: PropTypes.func.isRequired,
  match: PropTypes.object,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default AddWorkflow;
