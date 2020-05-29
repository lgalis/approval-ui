import { approvalHistory } from '../router';

const unAuthorizedMiddleware = () => (dispatch) => (action) => {
  const nextAction = { ...action };
  if (action.type.match(/_REJECTED$/) && action?.payload?.redirect) {
    setTimeout(() => {
      approvalHistory.push(action.payload.redirect.pathname, {
        from: approvalHistory.location
      });
    });
    return;
  }

  return dispatch(nextAction);
};

export default unAuthorizedMiddleware;
