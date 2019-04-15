import { getWorkflowApi } from '../../../helpers/shared/user-login';
import { APPROVAL_API_BASE } from '../../../utilities/constants';

describe('user login', () => {
  it('should set correct basePath for the workflow api instance', () => {
    const workflowApi = getWorkflowApi();
    expect(workflowApi.basePath).toEqual(APPROVAL_API_BASE);
  });
});
