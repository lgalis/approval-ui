import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import workflowInfoSchema from './workflow-info.schema';
import setGroupSelectSchema from './set-group-select.schema';
import worfklowMessages from '../messages/workflows.messages';

const sequenceField = (intl) => ({
  component: componentTypes.TEXT_FIELD,
  name: 'sequence',
  label: intl.formatMessage(worfklowMessages.enterSequence),
  isRequired: true,
  validate: [{ type: validatorTypes.REQUIRED }]
});

const addWorkflowSchema = (intl, id) => ({
  fields: [
    ...workflowInfoSchema(intl, id),
    setGroupSelectSchema(intl),
    ...(id ? [ sequenceField(intl) ] : [])
  ]
});

export default addWorkflowSchema;
