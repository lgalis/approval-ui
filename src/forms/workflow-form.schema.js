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
