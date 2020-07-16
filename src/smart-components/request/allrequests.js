import React from 'react';
import { APPROVAL_ADMIN_PERSONA } from '../../helpers/shared/helpers';
import RequestsList from './requests-list';
import routes from '../../constants/routes';
import { useIntl } from 'react-intl';
import requestsMessages from '../../messages/requests.messages';

const actionsDisabled = () => true;

const actionResolver = (intl) => (requestData) => {
  return (requestData && requestData.id && actionsDisabled(requestData) ? null :
    [
      {
        title: intl.formatMessage(requestsMessages.commentTitle),
        component: 'button',
        onClick: () => history.push({
          pathname: routes.allrequest.addComment,
          search: `?request=${requestData.id}`
        })
      }
    ]);
};

const AllRequests = () => {
  const intl = useIntl();

  return <RequestsList persona={ APPROVAL_ADMIN_PERSONA }
    actionsDisabled={ actionsDisabled }
    indexpath={ routes.allrequest }
    actionResolver={ actionResolver(intl) } />;
};

export default AllRequests;
