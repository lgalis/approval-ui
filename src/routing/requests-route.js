import React, { useContext } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import UserContext from '../user-context';
import paths from './../constants/routes';
import { isApprovalAdmin, isApprovalApprover } from '../helpers/shared/helpers';

const RequestsRoute = (props) => {
  const { userRoles: userRoles } = useContext(UserContext);
  const location = useLocation();

  if (isApprovalApprover(userRoles)) {
    return <Route { ...props } />;
  } else if (isApprovalAdmin(userRoles)) {
    return <Redirect
      to={ {
        pathname: paths.allrequests,
        state: {
          from: location
        }
      } }
    />;
  }
  else {
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
