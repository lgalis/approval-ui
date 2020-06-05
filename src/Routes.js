import { Route, Switch, Redirect } from 'react-router-dom';
import React, { lazy } from 'react';
import ProtectedRoute from './routing/protected-route';
import CommonApiError from './smart-components/error-pages/common-api-error';
import paths from './constants/routes';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const RequestDetail = lazy(() => import(/* webpackChunkName: "request-detail" */ './smart-components/request/request-detail/request-detail'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));
const AllRequests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/allrequests'));

const errorPaths = [ '/400', '/401', '/404' ];

export const Routes = () => (
  <Switch>
    <ProtectedRoute path={ paths.workflows.index } component={ Workflows }/>
    <Route path={ paths.requests.index } component={ Requests }/>
    <Route path={ paths.allrequests.index } component={ AllRequests }/>
    <Route path={ paths.request.index } component={ RequestDetail }/>
    <Route path={ errorPaths } component={ CommonApiError } />
    <Route>
      <Redirect to={ paths.requests.index } />
    </Route>
  </Switch>
);
