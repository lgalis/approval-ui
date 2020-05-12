const routes = {
  requests: {
    index: '/requests',
    detail: '/requests/detail',
    addComment: '/requests/detail/add-comment',
    approve: '/requests/detail/approve',
    deny: '/requests/detail/deny'
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
