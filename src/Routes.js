import { Route, Switch, Redirect } from 'react-router-dom';
import React, { lazy } from 'react';
import ProtectedRoute from './routing/protected-route';
import CommonApiError from './smart-components/error-pages/common-api-error';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const RequestDetail = lazy(() => import(/* webpackChunkName: "request-detail" */ './smart-components/request/request-detail/request-detail'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));
const AllRequests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/allrequests'));

const paths = {
  requests: '/requests',
  allrequests: '/allrequests',
  request: '/request',
  workflows: '/workflows'
};

const errorPaths = [ '/400', '/401', '/404' ];

export const Routes = () => (
  <Switch>
    <ProtectedRoute path={ paths.workflows } component={ Workflows }/>
    <Route path={ paths.requests } component={ Requests }/>
    <Route path={ paths.allrequests } component={ AllRequests }/>
    <Route path={ paths.request } component={ RequestDetail }/>
    <Route path={ errorPaths } component={ CommonApiError } />
    <Route>
      <Redirect to={ paths.requests } />
    </Route>
  </Switch>
);
