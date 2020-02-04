import MockAdapter from 'axios-mock-adapter';
import {
  getGraphqlInstance
} from '../../helpers/shared/user-login';

export const mockGraphql = new MockAdapter(getGraphqlInstance());
