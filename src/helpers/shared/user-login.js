import axios from 'axios';

import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../utilities/constants';
import { GroupApi, PrincipalApi, AccessApi } from '@redhat-cloud-services/rbac-client';
import { WorkflowApi, ActionApi, RequestApi, TemplateApi, StageApi } from '@redhat-cloud-services/approval-client';

const axiosInstance = axios.create();

const resolveInterceptor = response => response.data || response;

// check identity before each request. If the token is expired it will log out user
axiosInstance.interceptors.request.use(async config => {
  await window.insights.chrome.auth.getUser();
  return config;
});
axiosInstance.interceptors.response.use(resolveInterceptor);

// Approval Apis

const workflowApi = new WorkflowApi(undefined, APPROVAL_API_BASE, axiosInstance);
const actionApi = new ActionApi(undefined, APPROVAL_API_BASE, axiosInstance);
const requestApi = new RequestApi(undefined, APPROVAL_API_BASE, axiosInstance);
const templateApi = new TemplateApi(undefined, APPROVAL_API_BASE, axiosInstance);
const stageApi = new StageApi(undefined, APPROVAL_API_BASE, axiosInstance);

// RBAC APIs
const rbacAccessApi = new AccessApi(undefined, RBAC_API_BASE, axiosInstance);
const rbacPrincipalApi = new PrincipalApi(undefined, RBAC_API_BASE, axiosInstance);
const rbacGroupApi = new GroupApi(undefined, RBAC_API_BASE, axiosInstance);

// Approval APIs
export function getRequestApi() {
  return requestApi;
}

export function getTemplateApi() {
  return templateApi;
}

export function getStageApi() {
  return stageApi;
}

export function getWorkflowApi() {
  return workflowApi;
}

export function getActionApi() {
  return actionApi;
}

//RBAC APIs
export function getRbacAccessApi() {
  return rbacAccessApi;
}

export function getRbacPrincipalApi() {
  return rbacPrincipalApi;
}

export function getRbacGroupApi() {
  return rbacGroupApi;
}

export function getAxiosInstance() {
  return axiosInstance;
}
