import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import { FormattedMessage } from 'react-intl';

import debouncedValidatorName from './name-async-validator';

const workflowInfoSchema = (id) => ([{
  component: componentTypes.TEXT_FIELD,
  name: 'name',
  isRequired: true,
  id: 'workflow-name',
  label: <FormattedMessage
    id="create-approval-process-name-label"
    defaultMessage="Approval process name"
  />,
  validate: [
    (value) => debouncedValidatorName(value, id),
    {
      type: validatorTypes.REQUIRED,
      message: <FormattedMessage
        id="approval-procces-name-warning"
        defaultMessage="Enter a name for the approval process"
      />
    }]
}, {
  component: componentTypes.TEXTAREA,
  name: 'description',
  id: 'workflow-description',
  label: <FormattedMessage
    id="create-approval-process-description-label"
    defaultMessage="Description"
  />
}]);

export default workflowInfoSchema;
