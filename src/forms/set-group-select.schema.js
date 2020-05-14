import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import asyncDebounce from '../utilities/async-debounce';
import { fetchFilterApprovalGroups } from '../helpers/group/group-helper';
import { FormattedMessage } from 'react-intl';

const setGroupSelectSchema = (intl) => ({
  component: componentTypes.SELECT,
  name: 'wfGroups',
  label: <FormattedMessage
    id="create-approval-process-set-groups"
    defaultMessage="Set groups"
  />,
  loadOptions: asyncDebounce(fetchFilterApprovalGroups),
  isMulti: true,
  isSearchable: true,
  simpleValue: false,
  menuIsPortal: true,
  isClearable: true,
  placeholder: intl.formatMessage({
    id: 'create-approval-process-set-groups-placeholder',
    defaultMessage: 'Select...'
  })
});

export default setGroupSelectSchema;
