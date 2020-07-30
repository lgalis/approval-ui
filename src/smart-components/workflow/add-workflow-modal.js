import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';

import { addWorkflow, fetchWorkflows } from '../../redux/actions/workflow-actions';
import routes from '../../constants/routes';
import FormRenderer from '../common/form-renderer';
import addWorkflowSchema from '../../forms/add-workflow.schema';
import formMessages from '../../messages/form.messages';

const AddWorkflow = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const onSave = ({ group_refs = [], ...values }) => {
    push(routes.workflows.index);

    return dispatch(addWorkflow({
      ...values,
      group_refs: group_refs.length > 0 ? group_refs.map(group => ({ name: group.label, uuid: group.value })) : []
    }, intl)).then(() => dispatch(fetchWorkflows()));
  };

  const onCancel = () => push(routes.workflows.index);

  return (
    <Modal
      isOpen
      onClose={ onCancel }
      title={ intl.formatMessage(formMessages.createApprovalTitle) }
      variant="small"
    >
      <FormRenderer
        onSubmit={ onSave }
        onCancel={ onCancel }
        schema={ addWorkflowSchema(intl) }
        disableSubmit={ [ 'validating' ] }
      />
    </Modal>
  );
};

export default AddWorkflow;
