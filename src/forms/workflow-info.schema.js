import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import debouncedValidatorName from './name-async-validator';
import formMessages from '../messages/form.messages';

const workflowInfoSchema = (intl, id) => ([{
  component: componentTypes.TEXT_FIELD,
  name: 'name',
  isRequired: true,
  id: 'workflow-name',
  label: intl.formatMessage(formMessages.approvalProcessName),
  validate: [
    (value) => debouncedValidatorName(value, id, intl),
    {
      type: validatorTypes.REQUIRED,
      message: intl.formatMessage(formMessages.enterApprovalName)
    }]
}, {
  component: componentTypes.TEXTAREA,
  name: 'description',
  id: 'workflow-description',
  label: intl.formatMessage(formMessages.description)
}]);

export default workflowInfoSchema;
