import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../user-context';
import { useIsApprovalAdmin, useIsApprovalApprover } from '../helpers/shared/helpers';

const RequestsRoute = (props) => {
  const { userRoles: userRoles } = useContext(UserContext);
  const location = useLocation();
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  if (isApprovalApprover || isApprovalAdmin) {
    return <Route { ...props } />;
  } else {
    return <Redirect
      to={ {
        pathname: '/403',
        state: {
          from: location
        }
      } }
    />;
  }
};

export default RequestsRoute;
