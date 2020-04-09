import { componentTypes } from '@data-driven-forms/react-form-renderer';
import asyncDebounce from '../utilities/async-debounce';

const setGroupsSchema = (loadGroups) => ({
  fields: [
    {
      component: componentTypes.SELECT,
      name: 'selectedGroups',
      label: 'Select groups',
      loadOptions: asyncDebounce(loadGroups()),
      multi: true,
      isSearchable: true,
      isClearable: true
    }
  ]
});

export default setGroupsSchema;
