import React, { Fragment, useContext } from 'react';
import { Route, useHistory } from 'react-router-dom';
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
import { useIntl } from 'react-intl';

import requestsMessages from '../../messages/requests.messages';

const Requests = () => {
  const intl = useIntl();
  const { userRoles: userRoles } = useContext(UserContext);
  const history = useHistory();
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

  const actionResolver = (requestData) => {
    return (requestData && requestData.id && actionsDisabled(requestData) ? null :
      [
        {
          title: intl.formatMessage(requestsMessages.commentTitle),
          component: 'button',
          onClick: () => history.push({
            pathname: routesLinks.requests.addComment,
            search: `?request=${requestData.id}`
          })
        }
      ]);
  };

  return !isApprovalApprover ?
    <EmptyRequestList/>
    : <RequestsList
      routes={ routes }
      persona={ APPROVAL_APPROVER_PERSONA }
      actionsDisabled={ actionsDisabled }
      actionResolver={ actionResolver }
    />;
};

export default Requests;
