import { fetchWorkflowByName } from '../helpers/workflow/workflow-helper';
import asyncDebounce from '../utilities/async-debounce';

const validateName = (name, id) => fetchWorkflowByName(name)
.then(({ data }) => {
  const workflow = id ?
    data.find(wf => name === wf.name && id !== wf.id)
    : data.find(wf => name === wf.name);

  if (workflow) {
    throw 'Name has already been taken';
  }
});

export default asyncDebounce(validateName);
