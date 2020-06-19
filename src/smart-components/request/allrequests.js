import React from 'react';
import { APPROVAL_ADMIN_PERSONA } from '../../helpers/shared/helpers';
import RequestsList from './requests-list';

const AllRequests = () => {
  return <RequestsList persona={ APPROVAL_ADMIN_PERSONA } actionsDisabled={ () => true } type={'all'} />;
};

export default AllRequests;
