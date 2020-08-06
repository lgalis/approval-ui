import React, { Fragment, useContext } from 'react';
import { Route } from 'react-router-dom';
import { fetchRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import {
  APPROVAL_APPROVER_PERSONA, useIsApprovalAdmin,
  useIsApprovalApprover,
  isRequestStateActive
} from '../../helpers/shared/helpers';
import UserContext from '../../user-context';
import routesLinks from '../../constants/routes';
import RequestsList from './requests-list';
import EmptyRequestList from './EmptyRequestList';

import RequestActions from './request-actions';

const Requests = () => {
  const { userRoles: userRoles } = useContext(UserContext);
  const isApprovalAdmin = useIsApprovalAdmin(userRoles);
  const isApprovalApprover = useIsApprovalApprover(userRoles);

  const routes = () => <Fragment>
    <Route exact path={ routesLinks.requests.addComment } render={ props => <ActionModal { ...props }
      actionType={ 'Add Comment' }
      postMethod={ fetchRequests } /> }/>
    <Route exact path={ routesLinks.requests.approve } render={ props => <ActionModal { ...props } actionType={ 'Approve' }
      postMethod={ fetchRequests }/> } />
    <Route exact path={ routesLinks.requests.deny } render={ props => <ActionModal { ...props } actionType={ 'Deny' }
      postMethod={ fetchRequests }/> } />
  </Fragment>;

  const actionsDisabled = (requestData) => requestData &&
    requestData.state ?
    !isRequestStateActive(requestData.state) || requestData.number_of_children > 0 ||
      (!isApprovalApprover && !isApprovalAdmin) : true;

  const actionResolver = (request) => (
    request && request.id && actionsDisabled(request)
      ? null
      : <RequestActions
        commentLink={ routesLinks.requests.addComment }
        approveLink={ routesLinks.requests.approve }
        denyLink={ routesLinks.requests.deny }
        request={ request }
      />
  );

  return !isApprovalApprover ?
    <EmptyRequestList/>
    : <RequestsList
      routes={ routes }
      persona={ APPROVAL_APPROVER_PERSONA }
      actionResolver={ actionResolver }
    />;
};

export default Requests;
