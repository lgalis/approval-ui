import { Route, Switch, Redirect } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { RequestLoader } from './presentational-components/shared/loader-placeholders';
import ProtectedRoute from './routing/protected-route';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));

const paths = {
  requests: '/requests',
  workflows: '/workflows'
};
export const Routes = () => {
  return <Suspense fallback={ <RequestLoader /> }>
    <Switch>
      <ProtectedRoute path={ paths.workflows } component={ Workflows }/>
      <Route path={ paths.requests } component={ Requests }/>
      <Route>
        <Redirect to={ paths.requests } />
      </Route>
    </Switch>
  </Suspense>;
};
