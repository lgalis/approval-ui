import { shallowEqual, useSelector } from 'react-redux';

const useWorkflow = (id) => {
  const { workflows } = useSelector(({ workflowReducer: { workflows }}) => ({ workflows }), shallowEqual);

  return workflows && workflows.data && workflows.data.find((wf) => wf.id === id);
};

export default useWorkflow;
