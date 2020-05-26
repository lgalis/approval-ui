import { getAxiosInstance } from '../shared/user-login';
import { RBAC_API_BASE } from '../../utilities/constants';

export const fetchFilterApprovalGroups = (filterValue) => {
  const filterQuery = `&name=${filterValue}`;
  return getAxiosInstance().get(`${RBAC_API_BASE}/groups/?role_names=",Approval Administrator,Approval Approver,"
  ${filterValue && filterValue.length > 0
    ? filterQuery : ''}`)
  .then(({ data }) => (data && data.length > 0 ? data.map(({ uuid, name }) => ({ label: name, value: uuid })) : undefined));
};
