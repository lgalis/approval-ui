const { defineMessages } = require('react-intl');

const formMessages = defineMessages({
  createApprovalTitle: {
    id: 'formMessages.createApprovalTitle',
    defaultMessage: 'Create approval process'
  },
  generalInformation: {
    id: 'formMessages.generalInformation',
    defaultMessage: 'General information'
  },
  setGroups: {
    id: 'formMessages.setGroups',
    defaultMessage: 'Set groups'
  },
  review: {
    id: 'formMessages.Review',
    defaultMessage: 'Review'
  },
  enterInfo: {
    id: 'formMessages.enterInfo',
    defaultMessage: 'Enter your information'
  },
  approvalProcessName: {
    id: 'formMessages.approvalProcessName',
    defaultMessage: 'Approval process name'
  },
  enterApprovalName: {
    id: 'formMessages.enterApprovalName',
    defaultMessage: 'Enter a name for the approval process'
  },
  description: {
    id: 'formMessages.description',
    defaultMessage: 'Description'
  },
  nameTaken: {
    id: 'formMessages.nameTaken',
    defaultMessage: 'Name has already been taken'
  },
  selectPlaceholder: {
    id: 'formMessages.selectPlaceholder',
    defaultMessage: 'Select...'
  },
  summary: {
    id: 'formMessages.summary',
    defaultMessage: 'Summary'
  },
  groups: {
    id: 'formMessages.groups',
    defaultMessage: 'Groups'
  },
  summaryDescription: {
    id: 'formMessages.summaryDescription',
    defaultMessage: 'Review and confirm your inputs. If there is anything incorrect, click Back and revise.'
  }
});

export default formMessages;
