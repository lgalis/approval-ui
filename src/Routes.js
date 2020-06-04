import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import React, { lazy, useContext, useState, useEffect } from 'react';
import ProtectedRoute from './routing/protected-route';
import paths from './constants/routes';
import UserContext from './user-context';
import {APPROVAL_APPROVER_ROLE, useIsApprovalAdmin, useIsApprovalApprover} from './helpers/shared/helpers';
import RequestsRoute from './routing/requests-route';

const Requests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/requests'));
const RequestDetail = lazy(() => import(/* webpackChunkName: "request-detail" */ './smart-components/request/request-detail/request-detail'));
const Workflows = lazy(() => import(/* webpackChunkName: "workflows" */ './smart-components/workflow/workflows'));
const AllRequests = lazy(() => import(/* webpackChunkName: "requests" */ './smart-components/request/allrequests'));
const CommonApiError = lazy(() => import(/* webpackChunkName: "error-page" */ './smart-components/error-pages/common-api-error'));

const errorPaths = [ '/400', '/401', '/403', '/404' ];

export const Routes = () => {
  const { userRoles: userRoles } = useContext(UserContext);
  const location = useLocation();
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  const [defaultRequestPath, setDefaultRequestPath] = useState(paths.requests.index);

  useEffect(() => {
    if (isApprovalApprover || isApprovalAdmin) {
      setDefaultRequestPath(paths.requests.index);
    }
    else
      {
        setDefaultRequestPath({
          pathname: '/403',
          state: {
            from: location
          }
        });
      }
  }, [userRoles]);

  return <Switch>
    <ProtectedRoute path={ paths.workflows.index } component={ Workflows }/>
    <RequestsRoute path={ paths.requests.index } component={ Requests }/>
    <Route path={ paths.allrequests.index } component={ AllRequests }/>
    <Route path={ paths.request.index } component={ RequestDetail }/>
    <Route path={ errorPaths } component={ CommonApiError }/>
    <Route>
      <Redirect to={ defaultRequestPath }/>
    </Route>
  </Switch>;
};
