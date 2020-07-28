import React from 'react';
import { APPROVAL_ADMIN_PERSONA } from '../../helpers/shared/helpers';
import RequestsList from './requests-list';
import routes from '../../constants/routes';

const AllRequests = () => (
  <RequestsList
    persona={ APPROVAL_ADMIN_PERSONA }
    indexpath={ routes.allrequest }
  />
);

export default AllRequests;
