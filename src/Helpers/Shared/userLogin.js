import { APPROVAL_API_BASE, APPROVAL_USER, APPROVAL_PWD } from '../../Utilities/Constants';
import { AccessApi, PrincipalApi, WorkflowApi, ApiClient } from 'approval_api_jsclient';

const defaultApprovalClient = ApiClient.instance;
defaultApprovalClient.basePath = APPROVAL_API_BASE;

let approval_basic_auth = defaultApprovalClient.authentications.basic_auth;

if (APPROVAL_USER && APPROVAL_PWD) {
  approval_basic_auth.username = APPROVAL_USER;
  approval_basic_auth.password = APPROVAL_PWD;
}

let approvalApi = new AccessApi();
let principalApi = new PrincipalApi();
let workflowApi = new WorkflowApi();

export function getApprovalApi() {
  return approvalApi;
}

export function getPrincipalApi() {
  return principalApi;
}

export function getWorkflowApi() {
  return workflowApi;
}
