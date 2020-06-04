import React, { Fragment, useContext } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { fetchRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import {
  APPROVAL_APPROVER_PERSONA, isApprovalAdmin,
  isApprovalApprover,
  isRequestStateActive
} from '../../helpers/shared/helpers';
import UserContext from '../../user-context';
import routesLinks from '../../constants/routes';
import RequestsList from './requests-list';
import EmptyRequestList from './EmptyRequestList';

const Requests = () => {
  const { userRoles: userRoles } = useContext(UserContext);
  const history = useHistory();

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
      (!isApprovalApprover(userRoles) && !isApprovalAdmin(userRoles)) : true;

  const actionResolver = (requestData) => {
    return (requestData && requestData.id && actionsDisabled(requestData) ? null :
      [
        {
          title: 'Comment',
          component: 'button',
          onClick: () => history.push({
            pathname: routesLinks.requests.addComment,
            search: `?request=${requestData.id}`
          })
        }
      ]);
  };

  return !isApprovalApprover(userRoles)  ?
    <EmptyRequestList/>
    : <RequestsList
      routes={ routes }
      persona={ APPROVAL_APPROVER_PERSONA }
      actionsDisabled={ actionsDisabled }
      actionResolver={ actionResolver }
    />;
};

export default Requests;
