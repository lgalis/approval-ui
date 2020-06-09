const routes = {
  allrequests: {
    index: '/allrequests'
  },
  requests: {
    index: '/requests',
    addComment: '/requests/add-comment',
    approve: '/requests/approve',
    deny: '/requests/deny'
  },
  request: {
    index: '/request',
    addComment: '/request/add-comment',
    approve: '/request/approve',
    deny: '/request/deny'
  },
  workflows: {
    index: '/workflows',
    add: '/workflows/add-workflow',
    remove: '/workflows/remove',
    editInfo: '/workflows/edit-info',
    editGroups: '/workflows/edit-groups',
    editSequence: '/workflows/edit-sequence'
  }
};

export default routes;
