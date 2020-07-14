const { defineMessages } = require('react-intl');

const actionModalMessages = defineMessages({
  requestTitle: {
    id: 'actionModal.requestTitle',
    defaultMessage: 'Request #{id}'
  },
  requestActionTitle: {
    id: 'actionModal.requestTitle',
    defaultMessage: '{actionType} Request #{id}'
  },
  actionName: {
    id: 'actionModal.actionName',
    defaultMessage: '{actionType} Request'
  },
  fulfilledAction: {
    id: 'actionModal.fullfiledAction',
    defaultMessage: 'The {actionName} was successful.'
  },
  failedAction: {
    id: 'actionModal.failedAction',
    defaultMessage: 'The {actionName} action failed.'
  },
  successTitle: {
    id: 'actionModal.successTitle',
    defaultMessage: 'Success'
  },
  failedTitle: {
    id: 'actionModal.failedTitle',
    defaultMessage: '{actionName} error'
  }
});

export default actionModalMessages;
