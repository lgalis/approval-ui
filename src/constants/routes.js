const routes = {
  requests: {
    index: '/requests',
    detail: '/requests/detail',
    addComment: '/requests/detail/add_comment',
    approve: '/requests/detail/approve',
    deny: '/requests/detail/deny'
  },
  workflows: {
    index: '/workflows',
    add: '/workflows/add_workflow',
    remove: '/workflows/remove',
    editInfo: '/workflows/edit_info',
    editGroups: '/workflows/edit_groups',
    editSequence: '/workflows/edit_sequence'
  }
};

export default routes;
