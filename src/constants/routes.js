const routes = {
  allrequests: {
    index: '/allrequests'
  },
  requests: {
    index: '/requests',
    comment: '/requests/comment',
    approve: '/requests/approve',
    deny: '/requests/deny'
  },
  request: {
    index: '/request',
    comment: '/request/comment',
    approve: '/request/approve',
    deny: '/request/deny'
  },
  allrequest: {
    index: '/allrequest',
    comment: '/allrequest/comment',
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
