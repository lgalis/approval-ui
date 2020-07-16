const { defineMessages } = require('react-intl');

const worfklowMessages = defineMessages({
  editInfo: {
    id: 'worfklowMessages.editInfo',
    defaultMessage: 'Edit info'
  },
  editInformation: {
    id: 'worfklowMessages.editInformation',
    defaultMessage: 'Edit information'
  },
  editGroups: {
    id: 'worfklowMessages.editGroups',
    defaultMessage: 'Edit groups'
  },
  editSequence: {
    id: 'worfklowMessages.editSequence',
    defaultMessage: 'Edit sequence'
  },
  deleteApprovalTitle: {
    id: 'worfklowMessages.deleteApprovalTitle',
    defaultMessage: 'Delete approval process'
  },
  approvalProcess: {
    id: 'worfklowMessages.approvalProcess',
    defaultMessage: 'approval process'
  },
  approvalProcesses: {
    id: 'worfklowMessages.approvalProcesses',
    defaultMessage: 'approval processes'
  },
  fromProcessDependencies: {
    id: 'worfklowMessages.fromProcessDependencies',
    defaultMessage: 'from the following applications'
  },
  noApprovalProcesses: {
    id: 'worfklowMessages.noApprovalProcesses',
    defaultMessage: 'No approval processes'
  },
  sequence: {
    id: 'workflowMessages.sequence',
    defaultMessage: 'Sequence'
  },
  enterSequence: {
    id: 'workflowMessages.enterSequence',
    defaultMessage: 'Enter sequence'
  },
  removeProcessTitle: {
    id: 'workflowMessages.removeProcessTitle',
    defaultMessage: 'Delete {count, plural, one {approval process} other {approval processes}}?'
  },
  removeProcessAriaLabel: {
    id: 'workflowMessages.removeProcessTitle',
    defaultMessage: 'Delete {count, plural, one {approval process} other {approval processes}} modal'
  },
  removeProcessDescription: {
    id: 'workflowMessages.removeProcessDescription',
    defaultMessage: '{name} will be removed{dependenciesMessageValue}'
  },
  editProcessTitle: {
    id: 'workflowMessages.editProcessTitle',
    defaultMessage: 'Make any changes to approval process {name}'
  },
  editSequenceTitle: {
    id: 'workflowMessages.editSequenceTitle',
    defaultMessage: 'Set the sequence for the approval process {name}'
  },
  editGroupsTitle: {
    id: 'workflowMessages.editGroupsTitle',
    defaultMessage: 'Edit approval process\'s groups'
  },
  editGroupsLabel: {
    id: 'workflowMessages.editGroupsLabel',
    defaultMessage: 'Add or remove {name}\'s groups'
  },
  addProcessSuccessTitle: {
    id: 'workflowMessages.addProcessSuccessTitle',
    defaultMessage: 'Success adding approval process'
  },
  addProcessSuccessDescription: {
    id: 'workflowMessages.addProcessSuccessDescription',
    defaultMessage: 'The approval process was added successfully.'
  },
  updateProcessSuccessTitle: {
    id: 'workflowMessages.updateProcessSuccessTitle',
    defaultMessage: 'Success updating approval process'
  },
  updateProcessSuccessDescription: {
    id: 'workflowMessages.updateProcessSuccessDescription',
    defaultMessage: 'The approval process was updated successfully.'
  },
  removeProcessSuccessTitle: {
    id: 'workflowMessages.removeProcessSuccessTitle',
    defaultMessage: 'Success removing approval process'
  },
  removeProcessSuccessDescription: {
    id: 'workflowMessages.removeProcessSuccessDescription',
    defaultMessage: 'The approval process was removed successfully.'
  },
  removeProcessesSuccessTitle: {
    id: 'workflowMessages.removeProcessesSuccessTitle',
    defaultMessage: 'Success removing approval processes'
  },
  removeProcessesSuccessDescription: {
    id: 'workflowMessages.removeProcessesSuccessDescription',
    defaultMessage: 'The selected approval processes were removed successfully.'
  }
});

export default worfklowMessages;
