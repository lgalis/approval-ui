import { fetchRequestWithSubrequests } from '../../../helpers/request/request-helper';
import { mockGraphql } from '../../__mocks__/user-login';
import { APPROVAL_API_BASE } from '../../../utilities/constants';
import { APPROVAL_REQUESTER_PERSONA, APPROVAL_APPROVER_PERSONA } from '../../../helpers/shared/helpers';

describe('request-helper', () => {
  describe('#fetchRequestWithSubrequests', () => {
    let id;
    let persona;

    beforeEach(() => {
      id = 'some-id';
      persona = APPROVAL_REQUESTER_PERSONA;
    });

    it('no data', async () => {
      mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200,
        { data: {  requests: []}}
      );

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({});
    });

    it('is approver - data', async () => {
      persona = APPROVAL_APPROVER_PERSONA;

      mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200,
        {
          data: {
            requests: [
              {
                number_of_children: 1,
                requests: [{
                  name: 'request-1',
                  id: 'id1'
                }]
              }
            ]
          }
        }
      );

      apiClientMock.get(
        `${APPROVAL_API_BASE}/requests/some-id/requests`,
        mockOnce({
          body: {
            data: [
              { id: 'id1', description: 'some desc', metadata: { a: 'b' }}
            ]
          }
        })
      );

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({
        number_of_children: 1,
        requests: [{
          name: 'request-1',
          id: 'id1',
          description: 'some desc',
          metadata: { a: 'b' }
        }]
      });
    });

    it('is approver - no data', async () => {
      persona = APPROVAL_APPROVER_PERSONA;

      mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200,
        {
          data: {
            requests: [
              {
                number_of_children: 0,
                requests: []
              }
            ]
          }
        }
      );

      apiClientMock.get(
        `${APPROVAL_API_BASE}/requests/some-id`,
        mockOnce({
          body:
              { id: 'id1', description: 'some desc', metadata: { something: 'some' }}
        })
      );

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({
        number_of_children: 0,
        requests: [],
        metadata: { something: 'some' }
      });
    });

    it('no approver persona', async () => {
      mockGraphql.onPost(`${APPROVAL_API_BASE}/graphql`).replyOnce(200,
        {
          data: {
            requests: [
              {
                number_of_children: 1,
                requests: [{
                  name: 'request-1',
                  id: 'id1'
                }]
              }
            ]
          }
        }
      );

      const response = await fetchRequestWithSubrequests(id, persona);

      expect(response).toEqual({
        number_of_children: 1,
        requests: [{
          name: 'request-1',
          id: 'id1'
        }]
      });
    });
  });
});
