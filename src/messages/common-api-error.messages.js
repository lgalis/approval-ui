const { defineMessages } = require('react-intl');

const commonApiErrorMessages = defineMessages({
  unathorizedTitle: {
    id: 'commonApiError.401Title',
    defaultMessage: 'Unauthorized'
  },
  unathorizedDescription: {
    id: 'commonApiError.401Description',
    defaultMessage: 'You are not authorized to access this section'
  },
  forbiddenTitle: {
    id: 'commonApiError.403Title',
    defaultMessage: 'You do not have access to Approval'
  },
  forbiddenDescription: {
    id: 'commonApiError.403Description',
    defaultMessage: 'Contact your organization administrator for more information'
  },
  returnBack: {
    id: 'commonApiError.returnBack',
    defaultMessage: 'Return to previous page'
  },
  goToLanding: {
    id: 'commonApiError.goToLanding',
    defaultMessage: 'Go to landing page'
  }
});

export default commonApiErrorMessages;
