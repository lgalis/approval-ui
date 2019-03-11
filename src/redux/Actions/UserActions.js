import * as ActionTypes from '../ActionTypes';
import * as RequestHelper from '../../Helpers/Request/RequestHelper';

const doFetchRequests = () => ({
  type: ActionTypes.FETCH_REQUESTS,
  payload: new Promise(resolve => {
    resolve(RequestHelper.fetchRequests());
  })
});

export const fetchRequests = () => (dispatch, getState) => {
  const { userReducer: { isRequestDataLoading }} = getState();
  if (!isRequestDataLoading) {
    return dispatch(doFetchRequests());
  }
};

export const fetchWorkflowsByRequestId = apiProps => ({
  type: ActionTypes.FETCH_WORKGROUPS_BY_REQUEST_ID,
  payload: new Promise(resolve => {
    resolve(RequestHelper.fetchWorkflowsByRequestId(apiProps));
  })
});

export const addRequest = (userData) => ({
  type: ActionTypes.ADD_REQUEST,
  payload: RequestHelper.addRequest(userData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success adding approver',
        description: 'The approver was added successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed adding approver',
        description: 'The approver was not added successfuly.'
      }
    }
  }
});

export const updateRequest = (userData) => ({
  type: ActionTypes.UPDATE_REQUEST,
  payload: RequestHelper.updateRequest(userData),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success updating approver',
        description: 'The approver was updated successfully.'
      },
      rejected: {
        variant: 'danger',
        title: 'Failed updating approver',
        description: 'The approver was not updated successfuly.'
      }
    }
  }
});

export const removeRequest = (user) => ({
  type: ActionTypes.REMOVE_REQUEST,
  payload: RequestHelper.removeRequest(user),
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Success removing user',
        description: 'The user was removed successfully.'
      }
    }
  }
});

