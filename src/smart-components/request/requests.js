import React, { Fragment, useContext } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { fetchRequests } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import {
  APPROVAL_APPROVER_PERSONA,
  isApprovalApprover,
  isRequestStateActive
} from '../../helpers/shared/helpers';
import UserContext from '../../user-context';
import routesLinks from '../../constants/routes';
import RequestsList from './requests-list';

const Requests = () => {
  const { userPersona: userPersona } = useContext(UserContext);
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
    !isRequestStateActive(requestData.state) || requestData.number_of_children > 0 || !isApprovalApprover(userPersona) : true;

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

  return <RequestsList
    routes={ routes }
    persona={ APPROVAL_APPROVER_PERSONA }
    actionsDisabled={ actionsDisabled }
    actionResolver={ actionResolver }
  />;
};

export default Requests;
