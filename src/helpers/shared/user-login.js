import axios from 'axios';
import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { AccessApi, GroupApi, ApiClient as RbacApiClient } from 'rbac_api_jsclient';

import { WorkflowApi, RequestApi, TemplateApi } from '@redhat-cloud-services/approval-client';

const responseInterceptor = response => response.data ? response.data : response;

const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(responseInterceptor);

let workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);
let requestApi = new RequestApi(undefined, APPROVAL_API_BASE, axiosInstance);
let templateApi = new TemplateApi(undefined, APPROVAL_API_BASE, axiosInstance);

export function getTemplateApi() {
  return templateApi;
}

export function getWorkflowApi() {
  return workflowApi;
}

export function getRequestApi() {
  return requestApi;
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
