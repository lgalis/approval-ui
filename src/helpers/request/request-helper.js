import { getActionApi, getRequestApi, getStageApi } from '../shared/user-login';

const requestApi = getRequestApi();
const stageApi = getStageApi();
const actionApi = getActionApi();

export function fetchRequests({ limit, offset }) {
  return requestApi.listRequests(undefined, limit, offset);
}

export async function fetchRequest(id) {
  return await requestApi.showRequest(id);
}

export async function fetchRequestWithStagesAndActions(id) {
  const requestData = await requestApi.showRequest(id);
  const requestStages = await fetchStagesWithActions(id);
  return { ...requestData, stages: requestStages.data };
}

export async function fetchStagesForRequest(id) {
  return await stageApi.listStagesByRequest(id);
}

export async function fetchStagesWithActions(requestId) {
  const requestStages = await stageApi.listStagesByRequest(requestId);
  const stages = requestStages.data;
  return Promise.all(stages.map(async stage => {
    const stageWithActions = await actionApi.listActionsByStage(stage.id);
    return { ...stage, stageActions: stageWithActions };
  })).then(data => ({
    ...requestStages,
    data
  }));
}

export async function createStageAction (stageId, actionIn) {
  return await actionApi.createAction(stageId, actionIn);
}

;
