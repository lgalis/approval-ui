import React from 'react';
import routes from '../../../constants/routes';
import useQuery from '../../../utilities/use-query';
import RequestDetail from './request-detail';

const AllRequestDetail = () => {
  const [{ request: id }] = useQuery([ 'request' ]);
  const allRequestsBreadcrumbs = [
    { title: 'All requests', to: routes.allrequests.index, id: 'allrequests' },
    { title: `Request ${id}`, id }
  ];
  return <RequestDetail requestBreadcrumbs={ allRequestsBreadcrumbs } />;
};

export default AllRequestDetail;
