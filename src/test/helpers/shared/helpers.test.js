import {
  approvalPersona,
  approvalRoles,
  APPROVAL_ADMIN_PERSONA,
  APPROVAL_APPROVER_PERSONA,
  APPROVAL_REQUESTER_PERSONA,
  APPROVAL_ADMINISTRATOR_ROLE,
  APPROVAL_APPROVER_ROLE
} from '../../../helpers/shared/helpers';

describe('Shared helpers', () => {
  describe('#approvalPersona', () => {
    let roles;

    beforeEach(() => {
      roles = {};
    });

    it('is admin', () => {
      roles[APPROVAL_APPROVER_ROLE] = true;
      roles[APPROVAL_ADMINISTRATOR_ROLE] = true;

      expect(approvalPersona(roles)).toEqual(APPROVAL_ADMIN_PERSONA);
    });

    it('is approver', () => {
      roles[APPROVAL_APPROVER_ROLE] = true;

      expect(approvalPersona(roles)).toEqual(APPROVAL_APPROVER_PERSONA);
    });

    it('is requester', () => {
      roles = [{}];

      expect(approvalPersona(roles)).toEqual(APPROVAL_REQUESTER_PERSONA);
    });
  });

  describe('#approvalRoles', () => {
    let roles;

    beforeEach(() => {
      roles = {};
    });

    it('is admin', () => {
      roles = [{ name: APPROVAL_ADMINISTRATOR_ROLE, uuid: 1 }];
      expect(approvalRoles(roles)[APPROVAL_ADMINISTRATOR_ROLE]).toBeTruthy();
    });

    it('is approver', () => {
      roles = [{ name: APPROVAL_APPROVER_ROLE, uuid: 1 }];
      expect(approvalRoles(roles)[APPROVAL_APPROVER_ROLE]).toBeTruthy();
    });

  });

});
