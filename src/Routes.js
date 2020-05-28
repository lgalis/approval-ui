import { Route, Switch, Redirect } from 'react-router-dom';
import React, { lazy, useContext } from 'react';
import ProtectedRoute from './routing/protected-route';
import CommonApiError from './smart-components/error-pages/common-api-error';
import paths from './constants/routes';
import UserContext from './user-context';
import { isApprovalAdmin, isApprovalApprover } from './helpers/shared/helpers';
import RequestsRoute from './routing/requests-route';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const RequestDetail = lazy(() => import(/* webpackChunkName: "request-detail" */ './smart-components/request/request-detail/request-detail'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));
const AllRequests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/allrequests'));
const errorPaths = [ '/400', '/401', '/403', '/404' ];

export const Routes = () => {
  const { userRoles: userRoles } = useContext(UserContext);

  const defaultRequestPath = () => {
    if (isApprovalApprover(userRoles)) {
      return paths.requests.index;}

    if (isApprovalAdmin(userRoles)) {
      return paths.allrequests.index;
    } else {
      return errorPaths;
    }
  };

  return <Switch>
    <ProtectedRoute path={ paths.workflows.index } component={ Workflows }/>
    <RequestsRoute path={ paths.requests.index } component={ Requests }/>
    <Route path={ paths.allrequests.index } component={ AllRequests }/>
    <Route path={ paths.request.index } component={ RequestDetail }/>
    <Route path={ errorPaths } component={ CommonApiError }/>
    <Route>
      <Redirect to={ defaultRequestPath() }/>
    </Route>
  </Switch>;
};
