import workflowInfoSchema from './workflow-info.schema';
import setGroupSelectSchema from './set-group-select.schema';
import setCurrentGroupsSchema from './set-current-groups.schema';

const addWorkflowSchema = (intl, id) => ({
  fields: [
    ...workflowInfoSchema(intl, id),
    setGroupSelectSchema(intl),
    setCurrentGroupsSchema(intl)
  ]
});

export default addWorkflowSchema;
