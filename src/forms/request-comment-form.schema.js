import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

export const createRequestCommentSchema = (isDeny = false) => ({
  fields: [{
    component: componentTypes.TEXTAREA,
    name: 'comments',
    isRequired: isDeny,
    label: isDeny ? 'Reason' : 'Comment',
    ...(isDeny && { validate: [{ type: validatorTypes.REQUIRED }]})
  }]
});
