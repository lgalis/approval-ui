import React from 'react';
import routes from '../../../constants/routes';
import useQuery from '../../../utilities/use-query';
import RequestDetail from './request-detail';

const MyRequestDetail = () => {
  const [{ request: id }] = useQuery([ 'request' ]);
  const myRequestsBreadcrumbs = [
    { title: 'My requests', to: routes.requests.index, id: 'requests' },
    { title: `Request ${id}`, id }
  ];
  return <RequestDetail requestBreadcrumbs={ myRequestsBreadcrumbs } indexpath={ routes.request } />;
};

export default MyRequestDetail;
