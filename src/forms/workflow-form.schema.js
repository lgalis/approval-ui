import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const createWorkflowSchema = (newRecord, rbacGroups) => ({
  fields: [{
    component: componentTypes.WIZARD,
    name: 'workflow_wizard',
    fields: [{
      title: 'Workflow information',
      name: 'wf_step_info',
      stepKey: 1,
      nextStep: 'wf_step_stages',
      fields: [{
        component: componentTypes.TEXTAREA_FIELD,
        name: 'name',
        type: 'text',
        isRequired: true,
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
    }, {
      stepKey: 'wf_step_stages',
      title: 'Set Approval Stages',
      name: 'wf_step_stages',
      nextStep: 'summary',
      component: componentTypes.FORM_GROUP,
      fields: [{
        name: 'wfGroups',
        component: componentTypes.FIELD_ARRAY,
        fields: [{
          component: componentTypes.SELECT,
          name: 'stage',
          isRequired: false,
          label: '1st Stage',
          options: rbacGroups
        }]
      }]
    }, {
      fields: [{
        name: 'summary',
        component: 'summary'
      }],
      stepKey: 'summary',
      name: 'summary'
    }]
  }]
});
