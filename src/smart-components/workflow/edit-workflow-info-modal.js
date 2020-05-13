import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import { useIntl, FormattedMessage } from 'react-intl';

import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';
import FormRenderer from '../common/form-renderer';
import routes from '../../constants/routes';
import workflowInfoSchema from '../../forms/workflow-info.schema';

const createSchema = (editType, name, intl) => editType === 'info' ? ({
  fields: [{
    component: componentTypes.SUB_FORM,
    title: <span className="pf-c-title pf-m-md">
      <FormattedMessage
        id="edit-info-title-subform"
        defaultMessage="Make any changes to approval process {name}"
        values={ { name } } />
    </span>,
    name: 'info-sub',
    fields: workflowInfoSchema(intl)
  }]
}) : ({
  fields: [{
    component: componentTypes.SUB_FORM,
    title: <span className="pf-c-title pf-m-md">
      <FormattedMessage
        id="edit-sequence-title-subform"
        defaultMessage="Set the sequence for the approval process {name}"
        values={ { name } } />
    </span>,
    name: 'info-sub',
    fields: [{
      component: componentTypes.TEXT_FIELD,
      name: 'sequence',
      label: intl.formatMessage({ id: 'sequence-label', defaultMessage: 'Enter sequence' }),
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }]
    }]
  }]
});

const reducer = (state, { type, initialValues, schema }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        initialValues,
        schema,
        isLoading: false
      };
    default:
      return state;
  }
};

const EditWorkflowInfoModal = ({
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  postMethod,
  editType
}) => {
  const [ state, dispatch ] = useReducer(reducer, { isLoading: true });
  const intl = useIntl();

  const { push } = useHistory();
  const [{ workflow: id }] = useQuery([ 'workflow' ]);
  const loadedWorkflow = useWorkflow(id);

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id)
      .then((data) => dispatch({ type: 'loaded', initialValues: data.value, schema: createSchema(editType, data.value.name, intl) }));
    } else {
      dispatch({ type: 'loaded', initialValues: loadedWorkflow, schema: createSchema(editType, loadedWorkflow.name, intl) });
    }
  }, []);

  const onSave = ({ name, description, sequence }) => {
    const workflowData = { id, name, description, sequence };
    updateWorkflow(workflowData).then(() => postMethod()).then(() => push(routes.workflows.index));
  };

  const onCancel = () => {
    const { title, description } =
        editType === 'sequence' ? { title: `Edit approval process's sequence`,
          description: `Edit approval process's sequence was cancelled by the user.` } :
          { title: `Edit approval process's information`,
            description: `Edit approval process's information was cancelled by the user.` };
    addNotification({
      variant: 'warning',
      title,
      dismissable: true,
      description
    });
    push(routes.workflows.index);
  };

  return (
    <Modal
      title={ editType === 'sequence' ? 'Edit sequence' : 'Edit information' }
      width={ '40%' }
      isOpen
      onClose={ onCancel }
    >
      { state.isLoading && <WorkflowInfoFormLoader/> }
      {
        !state.isLoading && <FormRenderer
          FormTemplate={ (props) => <FormTemplate
            { ...props }
            submitLabel={ <FormattedMessage id="save" defaultMessage="Save" /> }
            buttonClassName="pf-u-mt-0"
          /> }
          onCancel={ onCancel }
          onSubmt={ onSave }
          initialValues={ state.initialValues }
          schema={ state.schema }
        />
      }
    </Modal>
  );
};

EditWorkflowInfoModal.defaultProps = {
  editType: 'info'
};

EditWorkflowInfoModal.propTypes = {
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired,
  editType: PropTypes.string
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflow
}, dispatch);

export default connect(null, mapDispatchToProps)(EditWorkflowInfoModal);
