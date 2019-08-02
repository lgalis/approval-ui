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
      component: componentTypes.SUB_FORM,
      title: 'Set Approval Stages',
      name: 'workflow_edit_stages',
      fields: [{
        component: componentTypes.SELECT,
        name: 'stage-1',
        isRequired: false,
        label: '1st Stage',
        options: rbacGroups
      },
      {
        component: componentTypes.SELECT,
        name: 'stage-2',
        label: '2nd Stage',
        options: rbacGroups
      },
      {
        component: componentTypes.SELECT,
        name: 'stage-3',
        label: '3rd Stage',
        options: rbacGroups
      }
      ]
    }]}
);
