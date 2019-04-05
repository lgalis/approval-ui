import axios from 'axios';

import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { AccessApi, PrincipalApi, GroupApi, ApiClient } from 'rbac_api_jsclient';
import { WorkflowApi, RequestApi, TemplateApi } from '@redhat-cloud-services/approval-client';

const axiosInstance = axios.create();

const resolveInterceptor = response => response.data || response;

axiosInstance.interceptors.response.use(resolveInterceptor);

const workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);
const requestApi = new RequestApi(undefined, APPROVAL_API_BASE, axiosInstance);
const templateApi = new TemplateApi(undefined, APPROVAL_API_BASE, axiosInstance);

const defaultRbacClient = ApiClient.instance;
defaultRbacClient.basePath = RBAC_API_BASE;

const rbacAccessApi = new AccessApi();
const rbacPrincipalApi = new PrincipalApi();
const rbacGroupApi = new GroupApi();

export function getRequestApi() {
  return requestApi;
}

export function getTemplateApi() {
  return templateApi;
}

export function getWorkflowApi() {
  return workflowApi;
}

export function getRbacAccessApi() {
  return rbacAccessApi;
}

export function getRbacPrincipalApi() {
  return rbacPrincipalApi;
}

export function getRbacGroupApi() {
  return rbacGroupApi;
}

