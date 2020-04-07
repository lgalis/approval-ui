import { Route, Switch, Redirect } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import { RequestLoader } from './presentational-components/shared/loader-placeholders';
import ProtectedRoute from './routing/protected-route';
import CommonApiError from './smart-components/error-pages/common-api-error';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));

const paths = {
  requests: '/requests',
  workflows: '/workflows'
};
const errorPaths = [ '/400', '/401', '/404' ];

export const Routes = () => {
  return <Suspense fallback={ <RequestLoader /> }>
    <Switch>
      <ProtectedRoute path={ paths.workflows } component={ Workflows }/>
      <Route path={ paths.requests } component={ Requests }/>
      <Route path={ errorPaths } component={ CommonApiError } />
      <Route>
        <Redirect to={ paths.requests } />
      </Route>
    </Switch>
  </Suspense>;
};
