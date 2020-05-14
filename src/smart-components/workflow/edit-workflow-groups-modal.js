import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import { Modal } from '@patternfly/react-core';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import { useIntl, FormattedMessage } from 'react-intl';

import FormRenderer from '../common/form-renderer';
import { addWorkflow, updateWorkflow, fetchWorkflow } from '../../redux/actions/workflow-actions';
import { WorkflowInfoFormLoader } from '../../presentational-components/shared/loader-placeholders';
import useQuery from '../../utilities/use-query';
import useWorkflow from '../../utilities/use-workflows';
import setGroupSelectSchema from '../../forms/set-group-select.schema';

const reducer = (state, { type, initialValues }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        initialValues,
        isLoading: false
      };
    default:
      return state;
  }
};

const EditWorkflowGroupsModal = ({
  addNotification,
  fetchWorkflow,
  updateWorkflow,
  postMethod
}) => {
  const [ state, dispatch ] = useReducer(reducer, { isLoading: true });

  const intl = useIntl();

  const { push } = useHistory();
  const [{ workflow: id }] = useQuery([ 'workflow' ]);
  const loadedWorkflow = useWorkflow(id);

  const prepareInitialValues = (wfData) => {
    const groupOptions = wfData.group_refs.map((group) => {
      return { label: group.name, value: group.uuid };
    });
    const data = { ...wfData, wfGroups: groupOptions };
    return data;
  };

  useEffect(() => {
    if (!loadedWorkflow) {
      fetchWorkflow(id).then((result) => dispatch({ type: 'loaded', initialValues: prepareInitialValues(result.value) }));
    } else {
      dispatch({ type: 'loaded', initialValues: prepareInitialValues(loadedWorkflow) });
    }
  }, []);

  const onSave = ({ wfGroups }) => {
    const workflowData = { group_refs: wfGroups ? wfGroups.map(group => ({ name: group.label, uuid: group.value })) : []};
    return updateWorkflow({ id, ...workflowData }).then(() => postMethod()).then(()=>push('/workflows'));
  };

  const onCancel = () => {
    addNotification({
      variant: 'warning',
      title: `Edit approval process's groups`,
      dismissable: true,
      description: `Edit approval process's groups was cancelled by the user.`
    });
    push('/workflows');
  };

  return (
    <Modal
      title={ `Edit approval process's groups` }
      width={ '40%' }
      isOpen
      onClose={ onCancel }>
      { state.isLoading ? <WorkflowInfoFormLoader/> : <FormRenderer
        FormTemplate={ (props) => <FormTemplate
          { ...props }
          submitLabel={ <FormattedMessage id="save" defaultMessage="Save" /> }
          buttonClassName="pf-u-mt-0"
          disableSubmit={ [ 'submitting' ] }
        /> }
        onCancel={ onCancel }
        onSubmit={ onSave }
        initialValues={ state.initialValues }
        schema={ {
          fields: [{
            ...setGroupSelectSchema(intl),
            label: intl.formatMessage({
              id: 'edit-groups-select-label',
              defaultMessage: `Add or remove {name}'s groups`
            }, { name: state.initialValues.name })
          }]
        } }
      /> }
    </Modal>
  );
};

EditWorkflowGroupsModal.propTypes = {
  addNotification: PropTypes.func.isRequired,
  fetchWorkflow: PropTypes.func.isRequired,
  postMethod: PropTypes.func.isRequired,
  updateWorkflow: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addNotification,
  addWorkflow,
  updateWorkflow,
  fetchWorkflow
}, dispatch);

export default connect(null, mapDispatchToProps)(EditWorkflowGroupsModal);
