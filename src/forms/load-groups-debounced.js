import asyncDebounce from '../utilities/async-debounce';
import { fetchFilterApprovalGroups } from '../helpers/group/group-helper';

export default asyncDebounce(fetchFilterApprovalGroups);
