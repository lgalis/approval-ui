import tableToolbarMessages from '../../messages/table-toolbar.messages';
import requestsMessages from '../../messages/requests.messages';

export const prepareChips = ({ name, requester, decision }, intl) => ([
  ...(name ? [{
    category: intl.formatMessage(tableToolbarMessages.name),
    key: 'name',
    chips: [{ name, value: name }]
  }] : []),
  ...(requester ? [{
    category: intl.formatMessage(requestsMessages.requesterColumn),
    key: 'requester',
    chips: [{ name: requester, value: requester }]
  }] : []),
  ...(decision && decision.length > 0 ? [{
    category: intl.formatMessage(requestsMessages.statusColumn),
    key: 'decision',
    chips: decision.map(dec => ({ name: dec, value: dec }))
  }] : [])
]);
