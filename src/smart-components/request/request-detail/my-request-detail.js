import React from 'react';
import routes from '../../../constants/routes';
import useQuery from '../../../utilities/use-query';
import RequestDetail from './request-detail';
import { useIntl } from 'react-intl';
import apsTabsMessages from '../../../messages/app-tabs.messages';
import requestsMessages from '../../../messages/requests.messages';

const MyRequestDetail = () => {
  const intl = useIntl();
  const [{ request: id }] = useQuery([ 'request' ]);
  const myRequestsBreadcrumbs = [
    { title: intl.formatMessage(apsTabsMessages.myRequests), to: routes.requests.index, id: 'requests' },
    { title: intl.formatMessage(requestsMessages.requestTitle, { id }), id }
  ];

  return <RequestDetail requestBreadcrumbs={ myRequestsBreadcrumbs } indexpath={ routes.request } />;
};

export default MyRequestDetail;
