import React from 'react';
import routes from '../../../constants/routes';
import useQuery from '../../../utilities/use-query';
import RequestDetail from './request-detail';
import { useIntl } from 'react-intl';
import apsTabsMessages from '../../../messages/app-tabs.messages';
import requestsMessages from '../../../messages/requests.messages';

const AllRequestDetail = () => {
  const intl = useIntl();
  const [{ request: id }] = useQuery([ 'request' ]);
  const allRequestsBreadcrumbs = [
    { title: intl.formatMessage(apsTabsMessages.allRequests), to: routes.allrequests.index, id: 'allrequests' },
    { title: intl.formatMessage(requestsMessages.requestTitle, { id }), id }
  ];
  return <RequestDetail indexpath={ routes.allrequest } requestBreadcrumbs={ allRequestsBreadcrumbs } />;
};

export default AllRequestDetail;
