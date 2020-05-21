import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

export const createRequestCommentSchema = (isDeny = false) => ({
  fields: [{
    component: componentTypes.TEXTAREA,
    name: 'comments',
    isRequired: isDeny,
    label: isDeny ? 'Reason' : 'Comment',
    ...(isDeny && { validate: [{ type: validatorTypes.REQUIRED }]})
  }]
});
