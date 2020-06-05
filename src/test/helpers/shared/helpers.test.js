import {
  approvalPersona,
  APPROVAL_ADMIN_PERSONA,
  APPROVAL_APPROVER_PERSONA,
  APPROVAL_REQUESTER_PERSONA,
  APPROVAL_ADMINISTRATOR_ROLE,
  APPROVAL_APPROVER_ROLE
} from '../../../helpers/shared/helpers';

describe('Shared helpers', () => {
  describe('#approvalPersona', () => {
    let roles;
    it('is admin', () => {
      roles = [{ name: APPROVAL_APPROVER_ROLE }, { name: APPROVAL_ADMINISTRATOR_ROLE }];

      expect(approvalPersona(roles)).toEqual(APPROVAL_ADMIN_PERSONA);
    });

    it('is approver', () => {
      roles = [{ name: APPROVAL_APPROVER_ROLE }];

      expect(approvalPersona(roles)).toEqual(APPROVAL_APPROVER_PERSONA);
    });

    it('is requester', () => {
      roles = [{ name: 'non-sense' }];

      expect(approvalPersona(roles)).toEqual(APPROVAL_REQUESTER_PERSONA);
    });
  });
});
