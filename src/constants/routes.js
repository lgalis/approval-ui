const routes = {
  requests: {
    index: '/requests',
    addComment: '/requests/add-comment',
    approve: '/requests/approve',
    deny: '/requests/deny'
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
