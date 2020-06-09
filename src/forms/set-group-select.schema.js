import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import { FormattedMessage } from 'react-intl';

import loadOptions from './load-groups-debounced';

const setGroupSelectSchema = (intl) => ({
  component: componentTypes.SELECT,
  name: 'wfGroups',
  label: <FormattedMessage
    id="create-approval-process-set-groups"
    defaultMessage="Set groups"
  />,
  loadOptions,
  noValueUpdates: true,
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
