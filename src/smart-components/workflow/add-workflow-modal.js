import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import FormRenderer from '../common/form-renderer';
import { createWorkflowSchema } from '../../forms/workflow-form.schema';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import SummaryContent from './summary_content';

const AddWorkflowModal = ({
  history: { push },
  match: { params: { id }},
  addWorkflow,
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  postMethod,
  rbacGroups
}) => {
  const [ initialValues, setInitialValues ] = useState([]);

  useEffect(() => {
    if (id) {
      fetchData(setInitialValues);
    }
  }, []);

  const fetchData = (setInitialValues)=> {
    fetchWorkflow(id).then((data) => {
      let values = data.value;
      data.value.group_refs.forEach((group, idx) => {
        if (rbacGroups.find(rbacGroup => rbacGroup.value === group)) {
          values[`stage-${idx + 1}`] = group;
        }
        else {
          addNotification({
            variant: 'warning',
            title: 'Editing workflow',
            description: `Stage-${idx + 1} group with id: ${group} no longer accessible`
          });
        }
      });
      setInitialValues(values);
    });
  };

  const onSubmit = data => {
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

  const groupOptions = [ ...rbacGroups, { value: undefined, label: 'None' }];
  const Summary = (data) => <SummaryContent values={ data.formOptions.getState().values } groupOptions={ groupOptions } />;

  return (
    <Modal
      title={ id ? 'Edit workflow' : 'Create workflow' }
      isOpen
      onClose={ onCancel }
      isSmall
    >
      <div style={ { padding: 8 } }>
        <FormRenderer
          schema={ createWorkflowSchema(!id, groupOptions) }
          schemaType="default"
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          initialValues={ { ...initialValues } }
          formFieldsMapper={ {
            ...formFieldsMapper,
            summary: Summary
          } }
          formContainer="modal"
          showFormControls={ false }
          buttonsLabels={ { submitLabel: 'Confirm' } }
        />
      </div>
    </Modal>
  );
};

AddWorkflowModal.defaultProps = {
  rbacGroups: [],
  initialValues: {}
};

AddWorkflowModal.propTypes = {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddWorkflowModal));
