import { fetchWorkflowByName } from '../helpers/workflow/workflow-helper';
import asyncDebounce from '../utilities/async-debounce';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

const validateName = (name) => fetchWorkflowByName(name)
.then(({ data }) => {
  return data.find(wf => name === wf.name)
    ? 'Name has already been taken'
    : undefined;
});

const debouncedValidator = asyncDebounce(validateName);

const workflowInfoSchema = (intl) => ([{
  component: componentTypes.TEXT_FIELD,
  name: 'name',
  isRequired: true,
  label: intl.formatMessage({
    id: 'create-approval-process-name-label',
    defaultMessage: 'Approval process name'
  }),
  validate: [
    (value) => debouncedValidator(value),
    {
      type: validatorTypes.REQUIRED,
      message: intl.formatMessage({
        id: 'approval-procces-name-warning',
        defaultMessage: 'Enter a name for the approval process'
      })
    }]
}, {
  component: componentTypes.TEXTAREA,
  name: 'description',
  label: intl.formatMessage({
    id: 'create-approval-process-description-label',
    defaultMessage: 'Description'
  })
}]);

export default workflowInfoSchema;
