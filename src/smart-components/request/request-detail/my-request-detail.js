import React from 'react';
import routes from '../../../constants/routes';

const MyRequestDetail = () => {
  const myRequestsBreadcrumbs = [
    { title: 'My requests', to: routes.requests.index, id: 'requests' },
    { title: `Request ${id}`, id }
  ];

  return <RequestDetail breadcrumbs = { myRequestsBreadcrumbs} />;
};

export default MyRequestDetail;
