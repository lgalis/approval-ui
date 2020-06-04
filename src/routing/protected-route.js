import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../user-context';
import { useIsApprovalAdmin } from '../helpers/shared/helpers';

const ProtectedRoute = (props) => {
  const { userRoles: userRoles } = useContext(UserContext);
  const location = useLocation();
  const isApprovalAdmin = useIsApprovalAdmin(userRoles)

  return  isApprovalAdmin ? (
    <Route { ...props } />
  ) : (
    <Redirect
      to={ {
        pathname: '/403',
        state: {
          from: location
        }
      } }
    />
  );
};

export default ProtectedRoute;
