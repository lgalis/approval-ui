import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const createEditWorkflowSchema = (type, name, rbacGroups) => (
  type === 'info' ?
    { fields: [{
      component: componentTypes.SUB_FORM,
      title: `Make any changes to workflow ${name}`,
      name: 'workflow_edit_info',
      fields: [{
        component: componentTypes.TEXTAREA_FIELD,
        name: 'name',
        type: 'text',
        label: 'Name',
        validate: [{
          type: validatorTypes.REQUIRED
        }]
      }, {
        component: componentTypes.TEXTAREA_FIELD,
        name: 'description',
        type: 'text',
        label: 'Description'
      }]
    }]} : { fields: [{
      name: 'wfGroups',
      component: componentTypes.FIELD_ARRAY,
      fields: [{
        component: componentTypes.SELECT,
        name: 'stage',
        isRequired: false,
        label: 'Stage',
        options: rbacGroups
      }]}
    ]
    }
);
