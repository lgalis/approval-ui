import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import requestsMessages from '../messages/requests.messages';

export const createRequestCommentSchema = (isDeny = false, intl) => ({
  fields: [{
    component: componentTypes.TEXTAREA,
    name: 'comments',
    isRequired: isDeny,
    label: isDeny ? intl.formatMessage(requestsMessages.reasonTitle) : intl.formatMessage(requestsMessages.commentTitle),
    ...(isDeny && { validate: [{ type: validatorTypes.REQUIRED }]})
  }]
});
