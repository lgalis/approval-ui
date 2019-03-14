import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../Utilities/Constants';
import { AdminsApi as ApprovalApi, RequestersApi, UsersApi, ApiClient as ApprovalApiClient  } from 'approval_api_jsclient';
import { AccessApi, GroupApi, ApiClient as RbacApiClient } from 'rbac_api_jsclient';

const approvalClient = ApprovalApiClient.instance;
approvalClient.basePath = APPROVAL_API_BASE;

let approvalApi = new ApprovalApi();
let requesterApi = new RequestersApi();
let userApi = new UsersApi();

export function getApprovalApi() {
  return approvalApi;
}

export function getUserApi() {
  return userApi;
}

export function getRequesterApi() {
  return requesterApi;
}

const rbacClient = RbacApiClient.instance;
rbacClient.basePath = RBAC_API_BASE;

const rbacApi = new AccessApi();
const groupApi = new GroupApi();

export function getRbacApi() {
  return rbacApi;
}

export function getGroupApi() {
  return groupApi;
}
