import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Wizard } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, fetchWorkflowWithGroupNames } from '../../../redux/actions/workflow-actions';
import SummaryContent from './summary-content';
import WorkflowInfoForm from './stage-information';
import SetStages from './set-stages';

const AddWorkflow = ({
  history: { push },
  addWorkflow,
  addNotification,
  postMethod,
  rbacGroups
}) => {
  const [ formData, setValues ] = useState({});
  const [ isValid, setIsValid ] = useState(formData.name !== undefined && formData.name.length > 0);

  const handleChange = data => {
    setValues({ ...formData,  ...data });
  };

  const steps = [
    { name: 'General information',
      enableNext: isValid && formData.name && formData.name.length > 0,
      component: <WorkflowInfoForm formData={ formData }
        handleChange={ handleChange }
        isValid={ isValid } setIsValid={ setIsValid }/> },
    { name: 'Set groups', component: <SetStages formData={ formData }
      handleChange={ handleChange } options={ rbacGroups } /> },
    { name: 'Review', component: <SummaryContent formData={ formData }
      options={ rbacGroups } />, nextButtonText: 'Confirm' }
  ];

  const onSave = () => {
    const { name, description, wfGroups } = formData;
    const workflowData = { name, description, group_refs: wfGroups ? wfGroups.map(group => group.value) : []};
    return addWorkflow(workflowData).then(() => postMethod()).then(() => (push('/workflows')));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: 'Creating approval process',
      dismissable: true,
      description: 'Creating approval process was cancelled by the user.'
    });
    push('/workflows');
  };

  return (
    <Wizard
      title={ 'Create approval process' }
      isOpen
      onClose={ onCancel }
      onSave={ onSave  }
      steps={ steps }
    />
  );
};

AddWorkflow.defaultProps = {
  rbacGroups: [],
  initialValues: {}
};

AddWorkflow.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  addWorkflow: PropTypes.func.isRequired,
  match: PropTypes.object,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflowWithGroupNames: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  rbacGroups: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

const mapStateToProps = (state) => {
  return {
    rbacGroups: state.groupReducer.groups
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  fetchWorkflowWithGroupNames
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddWorkflow));
