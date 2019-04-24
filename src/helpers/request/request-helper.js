import { getActionApi, getRequestApi, getStageApi } from '../shared/user-login';

const requestApi = getRequestApi();
const stageApi = getStageApi();
const actionApi = getActionApi();

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

export async function fetchRequestWithStagesAndActions(id) {
  let requestData = await requestApi.showRequest(id);
  let requestStages = await fetchStagesWithActions(id);
  return { ...requestData, stages: requestStages.data };
}

export async function fetchStagesForRequest(id) {
  return await stageApi.listStagesByRequest(id);
}

export async function fetchStagesWithActions(requestId) {
  let requestStages = await stageApi.listStagesByRequest(requestId);
  let stages = requestStages.data;
  return Promise.all(stages.map(async stage => {
    let stageWithActions = await actionApi.listActionsByStage(stage.id);
    return { ...stage, stageActions: stageWithActions };
  })).then(data => ({
    ...requestStages,
    data
  }));
}

export async function createStageAction (stageId, actionIn) {
  return await actionApi.createAction(stageId, actionIn);
};
