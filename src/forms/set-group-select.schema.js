import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

import loadOptions from './load-groups-debounced';
import formMessages from '../messages/form.messages';

const resolveNewGroupsProps = (
  props,
  _fieldApi,
  formOptions
) => {
  const initialGroups = formOptions.getState().values.current_groups || [];
  return {
    key: initialGroups.length, // used to trigger options re-load and disable options update
    loadOptions: (...args) =>
      (props)
      .loadOptions(...args)
      .then((data) =>
        data.map((option) => ({
          ...option,
          ...(initialGroups.find(({ value }) => value === option.value) // we have to disable options that are already in the chip group
            ? { isDisabled: true }
            : {})
        }))
      )
  };
};

const setGroupSelectSchema = (intl) => ({
  component: componentTypes.SELECT,
  name: 'group_refs',
  label: intl.formatMessage(formMessages.setGroups),
  loadOptions,
  initialValue: [],
  clearedValue: [],
  noValueUpdates: true,
  isMulti: true,
  isSearchable: true,
  simpleValue: false,
  menuIsPortal: true,
  isClearable: true,
  placeholder: intl.formatMessage(formMessages.selectPlaceholder),
  resolveProps: resolveNewGroupsProps
});

export default setGroupSelectSchema;
