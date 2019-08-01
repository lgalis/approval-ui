import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import FormRenderer from '../common/form-renderer';
import { createEditWorkflowSchema } from '../../forms/edit-workflow-form.schema';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';

const EditWorkflowModal = ({
  history: { push },
  match: { params: { id }},
  editType,
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
      if (editType === 'stages') {
        data.value.group_refs.forEach((group, idx) => {
          if (rbacGroups.find(rbacGroup => rbacGroup.value === group)) {
            values[`stage-${idx + 1}`] = group;
          }
          else {
            addNotification({
              variant: 'warning',
              title: `Edit workflow's information`,
              description: `Stage-${idx + 1} group with id: ${group} no longer accessible`
            });
          }
        });
      }

      console.log('DEBUG - initial values: ', values);
      setInitialValues(values);
    });
  };

  const onSubmit = data => {
    const { name, description, ...wfGroups } = data;
    const workflowData = { name, description, group_refs: wfGroups };
    updateWorkflow({ id, ...workflowData }).then(postMethod ?
      postMethod().then(push('/workflows')) : push('/workflows'));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: `Edit workflow's ${editType}`,
      description: `Edit workflow's ${editType} was cancelled by the user.`
    });
    postMethod ? postMethod().then(push('/workflows')) : push('/workflows');
  };

  const groupOptions = [ ...rbacGroups, { value: undefined, label: 'None' }];

  return (
    <Modal
      title={ id ? 'Edit workflow' : 'Create workflow' }
      isOpen
      onClose={ onCancel }
      isSmall
    >
      <div style={ { padding: 8 } }>
        <FormRenderer
          schema={ createEditWorkflowSchema(editType, initialValues.name, groupOptions) }
          schemaType="default"
          onSubmit={ onSubmit }
          onCancel={ onCancel }
          initialValues={ { ...initialValues } }
          formContainer="modal"
          buttonsLabels={ { submitLabel: 'Save' } }
        />
      </div>
    </Modal>
  );
};

EditWorkflowModal.defaultProps = {
  rbacGroups: [],
  initialValues: {}
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
  initialValues: PropTypes.object,
  updateWorkflow: PropTypes.func.isRequired,
  id: PropTypes.string,
  editType: PropTypes.string,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditWorkflowModal));
