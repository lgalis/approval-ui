import React from 'react';
import { APPROVAL_ADMIN_PERSONA } from '../../helpers/shared/helpers';
import RequestsList from './requests-list';
import routes from '../../constants/routes';

const actionsDisabled = () => true;

const actionResolver = (requestData) => {
  return (requestData && requestData.id && actionsDisabled(requestData) ? null :
    [
      {
        title: 'Comment',
        component: 'button',
        onClick: () => history.push({
          pathname: routes.allrequest.addComment,
          search: `?request=${requestData.id}`
        })
      }
    ]);
};

const AllRequests = () => {
  return <RequestsList persona={ APPROVAL_ADMIN_PERSONA }
    actionsDisabled={ actionsDisabled }
    indexpath={ routes.allrequest }
    actionResolver={ actionResolver } />;
};

export default AllRequests;
