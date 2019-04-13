import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';

const schemaFields = (commentName, validation) =>({
  component: componentTypes.TEXTAREA_FIELD,
  name: 'name',
  type: 'text',
  isRequired: validation,
  label: commentName
});

export const createRequestCommentSchema = (commentName, validation = false) => {
  let schema = schemaFields(commentName, validation);
  if (validation) {
    schema.validate = [{
      type: validatorTypes.REQUIRED
    }];
  }

  return { fields: [ schema ]};
};
