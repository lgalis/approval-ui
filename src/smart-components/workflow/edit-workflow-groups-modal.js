import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import { useIntl } from 'react-intl';

import FormRenderer from '../common/form-renderer';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';
import setGroupSelectSchema from '../../forms/set-group-select.schema';
import commonMessages from '../../messages/common.message';
import worfklowMessages from '../../messages/workflows.messages';

const createSchema = (name, intl) => ({
  fields: [{
    ...setGroupSelectSchema(intl),
    label: intl.formatMessage(worfklowMessages.editGroupsLabel, { name })
  }]
});

const prepareInitialValues = (wfData) => {
  const groupOptions = wfData.group_refs.map((group) =>
    ({ label: group.name, value: group.uuid })
  );
  return { ...wfData, wfGroups: groupOptions };
};

const reducer = (state, { type, initialValues, intl }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        schema: createSchema(initialValues.name, intl),
        initialValues: prepareInitialValues(initialValues),
        isLoading: false
      };
    default:
      return state;
  }
};

const EditWorkflowGroupsModal = ({
  fetchWorkflow,
  updateWorkflow,
  postMethod
}) => {
  const [ state, dispatch ] = useReducer(reducer, { isLoading: true });

  const intl = useIntl();

  const { push } = useHistory();
  const [{ workflow: id }] = useQuery([ 'workflow' ]);
  const loadedWorkflow = useWorkflow(id);

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id).then((result) => dispatch({ type: 'loaded', initialValues: prepareInitialValues(result.value), intl }));
    } else {
      dispatch({ type: 'loaded', initialValues: prepareInitialValues(loadedWorkflow), intl });
    }
  }, []);

  const onSave = ({ wfGroups }) => {
    const workflowData = { group_refs: wfGroups ? wfGroups.map(group => ({ name: group.label, uuid: group.value })) : []};
    return updateWorkflow({ id, ...workflowData }, intl).then(() => postMethod()).then(()=>push('/workflows'));
  };

  const onCancel = () => push('/workflows');

  return (
    <Modal
      title={ intl.formatMessage(worfklowMessages.editGroupsTitle) }
      variant="small"
      isOpen
      onClose={ onCancel }>
      { state.isLoading ? <WorkflowInfoFormLoader/> : <FormRenderer
        FormTemplate={ (props) => <FormTemplate
          { ...props }
          submitLabel={ intl.formatMessage(commonMessages.save) }
          buttonClassName="pf-u-mt-0"
          disableSubmit={ [ 'submitting' ] }
        /> }
        onCancel={ onCancel }
        onSubmit={ onSave }
        initialValues={ state.initialValues }
        schema={ state.schema }
      /> }
    </Modal>
  );
};

EditWorkflowGroupsModal.propTypes = {
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addWorkflow,
  updateWorkflow,
  fetchWorkflow
}, dispatch);

export default connect(null, mapDispatchToProps)(EditWorkflowGroupsModal);
