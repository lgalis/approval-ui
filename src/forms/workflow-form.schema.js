import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const createWorkflowSchema = (newRecord, rbacGroups) => ({
  component: 'wizard',
  name: 'workflow_wizard',
  assignFieldProvider: true,
  fields: [
    {
      title: 'Workflow information',
      name: 'wf_step_info',
      component: componentTypes.SUB_FORM,
      stepKey: 1,
      nextStep: {
        when: 'wf_name'
      },
      fields: [
        {
          component: 'textarea-field',
          name: 'wf-name',
          type: 'text',
          isRequired: true,
          label: 'Name',
          validate: [
            {
              type: validatorTypes.REQUIRED
            }
          ]
        },
        {
          component: 'textarea-field',
          name: 'wf-description',
          type: 'text',
          label: 'Name'
        }
      ]
    },
    {
      title: 'Set approval stages',
      component: componentTypes.SUB_FORM,
      name: 'step-2',
      stepKey: 2,
      nextStep: 'summary',
      fields: [
        {
          component: componentTypes.SELECT,
          name: 'stage-1',
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
    },
    {
      title: 'Please review the workflow details.',
      component: componentTypes.SUB_FORM,
      fields: [
        {
          name: 'summary',
          component: componentTypes.SUB_FORM,
          assignFieldProvider: true
        }
      ],
      stepKey: 'summary',
      name: 'summary'
    }
  ]
});

