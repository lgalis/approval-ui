import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Wizard } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../../redux/actions/workflow-actions';
import SummaryContent from './summary_content';

const AddWorkflow = ({
  history: { push },
  match: { params: { id }},
  addWorkflow,
  addNotification,
  updateWorkflow,
  postMethod,
  rbacGroups
}) => {
  const groupOptions = [ ...rbacGroups, { value: undefined, label: 'None' }];
  const StageInformation = (data) => <StageInformation values={ data.formOptions.getState().values } groupOptions={ groupOptions } />;
  const SetStages = (data) => <SetStages values={ data.formOptions.getState().values } groupOptions={ groupOptions } />;
  const Summary = (data) => <SummaryContent values={ data.formOptions.getState().values } groupOptions={ groupOptions } />;

  const steps = [
    { name: 'General Information', component: { StageInformation }},
    { name: 'Set Stages', component: { SetStages }},
    { name: 'Review', component: { Summary }, nextButtonText: 'Submit' }
  ];

  const onSave = data => {
    const { name, description, ...wfGroups } = data;
    const workflowData = { name, description, group_refs: Object.values(wfGroups) };
    id ? updateWorkflow({ id, ...workflowData }).
    then(postMethod ? postMethod().then(push('/workflows')) : push('/workflows'))
      : addWorkflow(workflowData).
      then(postMethod ? postMethod().then(push('/workflows')) : push('/workflows'));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: id ? 'Editing workflow' : 'Creating workflow',
      description: id ? 'Edit workflow was cancelled by the user.' : 'Creating workflow was cancelled by the user.'
    });
    postMethod ?  postMethod().then(push('/workflows')) : push('/workflows');
  };

  return (
    <Wizard
      title={ id ? 'Edit workflow' : 'Create workflow' }
      isOpen
      onClose={ onCancel }
      onSave={ onSave }
      steps= { steps }
    />
  );
};

AddWorkflow.defaultProps = {
  rbacGroups: [],
  initialValues: {}
};

AddWorkflow.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired,
  addWorkflow: PropTypes.func.isRequired,
  match: PropTypes.object,
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  updateWorkflow: PropTypes.func.isRequired,
  id: PropTypes.string,
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
  updateWorkflow,
  fetchWorkflow
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddWorkflow));
