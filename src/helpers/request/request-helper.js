import { getRequestApi, getStageApi } from '../shared/user-login';

const requestApi = getRequestApi();
const stageApi = getStageApi();

export function fetchRequests({ limit = 10, offset = 0 }) {
  return requestApi.listRequests(undefined, undefined, undefined, limit, offset);
}

export async function fetchRequest(id) {
  return await requestApi.showRequest(id);
}

export async function fetchRequestWithStages(id) {
  let requestData = await requestApi.showRequest(id);
  let requestStages = await stageApi.listStagesByRequest(id);
  return { ...requestData, stages: requestStages.data };
}

export async function fetchStagesForRequest(id) {
  return await stageApi.listStagesByRequest(id);
}
