import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

const schemaFields = (isDeny) =>({
  component: componentTypes.TEXTAREA_FIELD,
  name: 'comments',
  type: 'text',
  isRequired: isDeny,
  label: isDeny ? 'Reason' : 'Comment'
});

export const createRequestCommentSchema = (isDeny = false) => {
  let schema = schemaFields(isDeny);
  if (isDeny) {
    schema.validate = [{
      type: validatorTypes.REQUIRED
    }];
  }

  return { fields: [ schema ]};
};
