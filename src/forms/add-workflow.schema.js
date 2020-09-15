import workflowInfoSchema from './workflow-info.schema';
import setGroupSelectSchema from './set-group-select.schema';

const addWorkflowSchema = (intl, id) => ({
  fields: [
    ...workflowInfoSchema(intl, id),
    setGroupSelectSchema(intl)
  ]
});

export default addWorkflowSchema;
