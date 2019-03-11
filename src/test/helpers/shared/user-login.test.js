import { getWorkflowApi } from '../../../Helpers/Shared/userLogin';
import { APPROVAL_API_BASE } from '../../../Utilities/Constants';

describe('user login', () => {
  it('should set correct basePath for the workflow api instance', () => {
    const workflowApi = getWorkflowApi();
    expect(workflowApi.apiClient.basePath).toEqual(APPROVAL_API_BASE);
  });
});
