import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import { useIntl } from 'react-intl';

import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';
import FormRenderer from '../common/form-renderer';
import routes from '../../constants/routes';
import workflowInfoSchema from '../../forms/workflow-info.schema';
import commonMessages from '../../messages/common.message';
import worfklowMessages from '../../messages/workflows.messages';

const createSchema = (editType, name, intl, id) => editType === 'info' ? ({
  fields: [{
    component: componentTypes.SUB_FORM,
    title: <span className="pf-c-title pf-m-md">
      { intl.formatMessage(worfklowMessages.editProcessTitle, { name }) }
    </span>,
    name: 'info-sub',
    fields: workflowInfoSchema(intl, id)
  }]
}) : ({
  fields: [{
    component: componentTypes.SUB_FORM,
    title: <span className="pf-c-title pf-m-md">
      { intl.formatMessage(worfklowMessages.editSequenceTitle, { name }) }
    </span>,
    name: 'info-sub',
    fields: [{
      component: componentTypes.TEXT_FIELD,
      name: 'sequence',
      label: intl.formatMessage(worfklowMessages.enterSequence),
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
  fetchWorkflow,
  updateWorkflow,
  postMethod,
  editType
}) => {
  const [ state, dispatch ] = useReducer(reducer, { isLoading: true });

  const { push } = useHistory();
  const [{ workflow: id }] = useQuery([ 'workflow' ]);
  const loadedWorkflow = useWorkflow(id);
  const intl = useIntl();

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id)
      .then((data) => dispatch({ type: 'loaded', initialValues: data.value, schema: createSchema(editType, data.value.name, intl, data.value.id) }));
    } else {
      dispatch({ type: 'loaded', initialValues: loadedWorkflow, schema: createSchema(editType, loadedWorkflow.name, intl, loadedWorkflow.id) });
    }
  }, []);

  const onSave = ({ name, description, sequence }) => {
    const workflowData = { id, name, description, sequence };
    return updateWorkflow(workflowData, intl).then(() => postMethod()).then(() => push(routes.workflows.index));
  };

  const onCancel = () => push(routes.workflows.index);

  return (
    <Modal
      title={ editType === 'sequence' ? intl.formatMessage(worfklowMessages.editSequence) : intl.formatMessage(worfklowMessages.editInformation) }
      variant="small"
      isOpen
      onClose={ onCancel }
    >
      { state.isLoading && <WorkflowInfoFormLoader/> }
      {
        !state.isLoading && <FormRenderer
          FormTemplate={ (props) => <FormTemplate
            { ...props }
            submitLabel={ intl.formatMessage(commonMessages.save) }
            buttonClassName="pf-u-mt-0"
            disableSubmit={ [ 'submitting' ] }
          /> }
          onCancel={ onCancel }
          onSubmit={ onSave }
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
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired,
  editType: PropTypes.string
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addWorkflow,
  updateWorkflow,
  fetchWorkflow
}, dispatch);

export default connect(null, mapDispatchToProps)(EditWorkflowInfoModal);
