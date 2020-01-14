import MockAdapter from 'axios-mock-adapter';
import {
  getAxiosInstance,
  getGraphqlInstance
} from '../../helpers/shared/user-login';

export const mockApi = new MockAdapter(getAxiosInstance());
export const mockGraphql = new MockAdapter(getGraphqlInstance());
