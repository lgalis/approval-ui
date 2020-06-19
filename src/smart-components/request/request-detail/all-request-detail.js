import React from 'react';
import routes from '../../../constants/routes';

const AllRequestDetail = () => {
  const allRequestsBreadcrumbs = [
    { title: 'All requests', to: routes.allrequests.index, id: 'allrequests' },
    { title: `Request ${id}`, id }
  ];
  return <RequestDetail breadcrumbs = { allRequestsBreadcrumbs} />;
};

export default AllRequestDetail;
