import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import loadOptions from './load-groups-debounced';
import formMessages from '../messages/form.messages';

const setGroupSelectSchema = (intl) => ({
  component: componentTypes.SELECT,
  name: 'wfGroups',
  label: intl.formatMessage(formMessages.setGroups),
  loadOptions,
  noValueUpdates: true,
  isMulti: true,
  isSearchable: true,
  simpleValue: false,
  menuIsPortal: true,
  isClearable: true,
  placeholder: intl.formatMessage(formMessages.selectPlaceholder)
});

export default setGroupSelectSchema;
