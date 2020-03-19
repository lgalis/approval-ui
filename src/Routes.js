import { Route, Switch, Redirect } from 'react-router-dom';
import React, { lazy, Suspense, useContext } from 'react';
import { RequestLoader } from './presentational-components/shared/loader-placeholders';
import UserContext from './user-context';
import { isApprovalAdmin } from './helpers/shared/helpers';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));

const paths = {
  requests: '/requests',
  workflows: '/workflows'
};
export const Routes = () => {
  const { roles: userRoles } = useContext(UserContext);

  return <Suspense fallback={ <RequestLoader /> }>
    <Switch>
      { isApprovalAdmin(userRoles) && <Route path={ paths.workflows } component={ Workflows }/> }
      <Route path={ paths.requests } component={ Requests }/>
      <Route>
        <Redirect to={ paths.requests } />
      </Route>
    </Switch>
  </Suspense>;
};
