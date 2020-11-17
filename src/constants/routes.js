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
  allrequest: {
    index: '/allrequest',
    addComment: '/allrequest/add-comment',
    approve: '/allrequest/approve',
    deny: '/allrequest/deny'
  },
  workflows: {
    index: '/workflows',
    add: '/workflows/add-workflow',
    remove: '/workflows/remove',
    edit: '/workflows/edit'
  }
};

export default routes;
