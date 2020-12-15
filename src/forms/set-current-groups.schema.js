import formMessages from '../messages/form.messages';

const setCurrentGroupsSchema = (intl) => ({
  component: 'initial-chips',
  name: 'current_groups',
  label: intl.formatMessage(formMessages.existingGroupsMessage),
  initialValues: []
});

export default setCurrentGroupsSchema;
