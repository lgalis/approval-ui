import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import requestsMessages from '../messages/requests.messages';

export const createRequestCommentSchema = (commentRequired = false, intl) => ({
  fields: [{
    component: componentTypes.TEXTAREA,
    name: 'comments',
    isRequired: commentRequired,
    label: commentRequired ? intl.formatMessage(requestsMessages.reasonTitle) : intl.formatMessage(requestsMessages.commentTitle),
    ...(commentRequired && { validate: [{ type: validatorTypes.REQUIRED }]})
  }]
});
