import { fetchWorkflowByName } from '../helpers/workflow/workflow-helper';
import asyncDebounce from '../utilities/async-debounce';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

const validateName = (name, id) => fetchWorkflowByName(name)
.then(({ data }) => {
  const workflow = id ?
    data.find(wf => name === wf.name && id !== wf.id)
    : data.find(wf => name === wf.name);

  if (workflow) {
    throw 'Name has already been taken';
  }
});

const debouncedValidator = asyncDebounce(validateName);

const workflowInfoSchema = (intl, id) => ([{
  component: componentTypes.TEXT_FIELD,
  name: 'name',
  isRequired: true,
  id: 'workflow-name',
  label: intl.formatMessage({
    id: 'create-approval-process-name-label',
    defaultMessage: 'Approval process name'
  }),
  validate: [
    (value) => debouncedValidator(value, id),
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
  id: 'workflow-description',
  label: intl.formatMessage({
    id: 'create-approval-process-description-label',
    defaultMessage: 'Description'
  })
}]);

export default workflowInfoSchema;
