import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { Title } from '@patternfly/react-core';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import { addWorkflow, refreshWorkflows } from '../../../redux/actions/workflow-actions';
import routes from '../../../constants/routes';
import FormRenderer from '../../common/form-renderer';
import workflowInfoSchema from '../../../forms/workflow-info.schema';
import setGroupSelectSchema from '../../../forms/set-group-select.schema';

const AddWorkflow = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const intl = useIntl();

  const onSave = ({ wfGroups = [], ...values }) => {
    push(routes.workflows.index);
    return dispatch(addWorkflow({
      ...values,
      group_refs: wfGroups.length > 0 ? wfGroups.map(group => ({ name: group.label, uuid: group.value })) : []
    })).then(() => dispatch(refreshWorkflows()));
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
      schema={ {
        fields: [{
          name: 'wizard',
          title: intl.formatMessage({
            id: 'create-approval-process-title',
            defaultMessage: 'Create approval process'
          }),
          component: componentTypes.WIZARD,
          inModal: true,
          fields: [{
            name: 'general-information',
            showTitle: true,
            customTitle: <Title size="md"> { <FormattedMessage id="enter-info" defaultMessage="Enter your information" /> } </Title>,
            title: intl.formatMessage({
              id: 'create-approval-process-gen-info',
              defaultMessage: 'General information'
            }),
            nextStep: 'set-groups',
            fields: workflowInfoSchema(intl)
          }, {
            name: 'set-groups',
            nextStep: 'review',
            title: intl.formatMessage({
              id: 'create-approval-process-set-groups',
              defaultMessage: 'Set groups'
            }),
            fields: [ setGroupSelectSchema(intl) ]
          }, {
            name: 'review',
            title: intl.formatMessage({
              id: 'create-approval-process-review',
              defaultMessage: 'Review'
            }),
            fields: [{
              name: 'summary',
              component: 'summary'
            }]
          }]
        }]
      } }
    />
  );
};

export default AddWorkflow;
