export const prepareChips = ({ name, requester, status, decision }) => ([
  ...(name ? [{
    category: 'Name',
    key: 'name',
    chips: [{ name, value: name }]
  }] : []),
  ...(requester ? [{
    category: 'Requester',
    key: 'requester',
    chips: [{ name: requester, value: requester }]
  }] : []),
  ...(status && status.length > 0 ? [{
    category: 'Status',
    key: 'status',
    chips: status.map(stat => ({ name: stat, value: stat }))
  }] : []),
  ...(decision && decision.length > 0 ? [{
    category: 'Decision',
    key: 'decision',
    chips: decision.map(dec => ({ name: dec, value: dec }))
  }] : [])
]);
