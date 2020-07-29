import workflowInfoSchema from './workflow-info.schema';
import setGroupSelectSchema from './set-group-select.schema';

const addWorkflowSchema = (intl) => ({
  fields: [
    ...workflowInfoSchema(intl),
    setGroupSelectSchema(intl)
  ]
});

export default addWorkflowSchema;
