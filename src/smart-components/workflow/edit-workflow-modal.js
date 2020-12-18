import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import { fetchWorkflows, updateWorkflow } from '../../redux/actions/workflow-actions';
import routes from '../../constants/routes';
import FormRenderer from '../common/form-renderer';
import addWorkflowSchema from '../../forms/add-workflow.schema';
import worfklowMessages from '../../messages/workflows.messages';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';
import { fetchWorkflow } from '../../helpers/workflow/workflow-helper';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import commonMessages from '../../messages/common.message';

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

const prepareInitialValues = (wfData) => {
  const groupOptions = wfData.group_refs.map((group) =>
    ({ label: group.name, value: group.uuid })
  );
  return { ...wfData, group_refs: [], current_groups: groupOptions };
};

const EditWorkflow = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();
  const [{ workflow: id }] = useQuery([ 'workflow' ]);
  const loadedWorkflow = useWorkflow(id);

  const [{ initialValues, schema, isLoading }, stateDispatch ] = useReducer(reducer, { isLoading: true });

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id)
      .then((data) => stateDispatch({ type: 'loaded', initialValues: prepareInitialValues(data), schema: addWorkflowSchema(intl, data.id) }));
    } else {
      stateDispatch({ type: 'loaded', initialValues: prepareInitialValues(loadedWorkflow), schema: addWorkflowSchema(intl, loadedWorkflow.id) });
    }
  }, []);

  const onCancel = () => push(routes.workflows.index);

  const onSave = ({ group_refs = [], description = '', ...values }) => {
    onCancel();
    const groups = values.current_groups ?
      values.current_groups.concat(group_refs?.filter((item) => values.current_groups.indexOf(item) < 0)) : group_refs;
    const workflowData = { ...values, description, group_refs: groups.map(group => ({ name: group.label, uuid: group.value })) };
    delete workflowData.current_groups;
    return dispatch(updateWorkflow(workflowData, intl))
    .then(() => dispatch(fetchWorkflows()));
  };

  return (
    <Modal
      isOpen
      onClose={ onCancel }
      title={ intl.formatMessage(worfklowMessages.editInformation) }
      description={ !isLoading && intl.formatMessage(worfklowMessages.editProcessTitle, { name: initialValues.name }) }
      variant="small"
    >
      { isLoading && <WorkflowInfoFormLoader/> }
      { !isLoading && <FormRenderer
        onSubmit={ onSave }
        onCancel={ onCancel }
        schema={ schema }
        initialValues={ initialValues }
        FormTemplate={ (props) => <FormTemplate
          { ...props }
          submitLabel={ intl.formatMessage(commonMessages.save) }
          buttonClassName="pf-u-mt-0"
          disableSubmit={ [ 'validating', 'pristine' ] }
        /> }
      /> }
    </Modal>
  );
};

export default EditWorkflow;
