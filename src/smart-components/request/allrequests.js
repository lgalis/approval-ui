import React, { Fragment, useEffect, useReducer, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { expandable } from '@patternfly/react-table';
import { fetchRequests, expandRequest } from '../../redux/actions/request-actions';
import ActionModal from './action-modal';
import {APPROVAL_APPROVER_PERSONA, isApprovalApprover, isRequestStateActive} from '../../helpers/shared/helpers';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import UserContext from '../../user-context';
import routesLinks from '../../constants/routes';
import useQuery from '../../utilities/use-query';

const columns = [{
  title: 'Name',
  cellFormatters: [ expandable ]
},
  'Requester',
  'Opened',
  'Updated',
  'Status',
  'Decision'
];

const debouncedFilter = asyncDebounce(
    (filter, dispatch, filteringCallback, persona, meta = defaultSettings) => {
      filteringCallback(true);
      dispatch(fetchRequests(filter, persona, meta)).then(() =>
          filteringCallback(false)
      );
    },
    1000
);
const initialState = {
  filterValue: '',
  isOpen: false,
  isFetching: true,
  isFiltering: false
};

const requestsListState = (state, action) => {
  switch (action.type) {
    case 'setFetching':
      return { ...state, isFetching: action.payload };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload };
    default:
      return state;
  }
};

const RequestQueue = () => {
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
      !isRequestStateActive(requestData.state) || requestData.number_of_children > 0 : true;

  const actionResolver = (requestData) => {
    return (requestData && requestData.id && actionsDisabled(requestData) ? null :
        [
          {
            title: 'Comment',
            onClick: () => history.push({
              pathname: routesLinks.requests.addComment,
              search: `?request=${requestData.id}`
            })
          }
        ]);
  };

  return <Requests routes = {routes} persona={APPROVAL_APPROVER_PERSONA} actionsDisabled={actionsDisabled} actionResolver={actionResolver}/>
};

export default RequestQueue;
