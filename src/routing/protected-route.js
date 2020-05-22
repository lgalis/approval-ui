import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../user-context';
import { isApprovalAdmin } from '../helpers/shared/helpers';

const ProtectedRoute = (props) => {
  const { userPersona: userPersona } = useContext(UserContext);
  const location = useLocation();

  return  isApprovalAdmin(userPersona) ? (
    <Route { ...props } />
  ) : (
    <Redirect
      to={ {
        pathname: '/401',
        state: {
          from: location
        }
      } }
    />
  );
};

export default ProtectedRoute;
