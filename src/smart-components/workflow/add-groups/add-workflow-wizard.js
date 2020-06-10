import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/dist/cjs/actions';

import { addWorkflow, fetchWorkflows } from '../../../redux/actions/workflow-actions';
import routes from '../../../constants/routes';
import FormRenderer from '../../common/form-renderer';
import addWorkflowSchema from '../../../forms/add-workflow.schema';

const AddWorkflow = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const onSave = ({ wfGroups = [], ...values }) => {
    push(routes.workflows.index);
    return dispatch(addWorkflow({
      ...values,
      group_refs: wfGroups.length > 0 ? wfGroups.map(group => ({ name: group.label, uuid: group.value })) : []
    })).then(() => dispatch(fetchWorkflows()));
  };

  const onCancel = () => {
    dispatch(addNotification({
      variant: 'warning',
      title: 'Creating approval process',
      dismissable: true,
      description: 'Creating approval process was cancelled by the user.'
    }));
    push(routes.workflows.index);
  };

  return (
    <FormRenderer
      showFormControls={ false }
      onSubmit={ onSave }
      onCancel={ onCancel }
      schema={ addWorkflowSchema(intl) }
    />
  );
};

export default AddWorkflow;
