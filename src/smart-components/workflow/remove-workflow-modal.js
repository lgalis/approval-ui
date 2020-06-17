import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Modal, Button, Split, SplitItem, Text, TextContent, TextVariants, Spinner } from '@patternfly/react-core';
import { WarningTriangleIcon } from '@patternfly/react-icons';
import { removeWorkflow, removeWorkflows } from '../../redux/actions/workflow-actions';
import useQuery from '../../utilities/use-query';
import routes from '../../constants/routes';

const RemoveWorkflowModal = ({
  ids,
  removeWorkflow,
  removeWorkflows,
  fetchData,
  setSelectedWorkflows
}) => {
  const [ submitting, setSubmitting ] = useState(false);
  const { push } = useHistory();
  const [{ workflow: workflowId }] = useQuery([ 'workflow' ]);

  if (!workflowId && (!ids || ids.length === 0)) {
    return null;
  }

  const removeWf = () =>(workflowId ? removeWorkflow(workflowId) : removeWorkflows(ids))
  .catch(() => setSubmitting(false))
  .then(() => push(routes.workflows.index))
  .then(() => setSelectedWorkflows([]))
  .then(() => fetchData());

  const onCancel = () => push(routes.workflows.index);

  const onSubmit = () => {
    setSubmitting(true);
    return removeWf();
  };

  return (
    <Modal
      aria-label="remove-workflow"
      isOpen
      variant="small"
      width={ '40%' }
      title={ '' }
      onClose={ onCancel }
      actions={ [
        <Button id="cancel-remove-workflow" key="cancel" variant="secondary" type="button" onClick={ onCancel }>
          Cancel
        </Button>,
        <Button id="submit-remove-workflow" key="submit" variant="primary" type="button" isDisabled={ submitting } onClick={ onSubmit }>
          { submitting ? <React.Fragment><Spinner size="sm" /> Removing </React.Fragment> : 'Remove' }
        </Button>
      ] }
    >
      <Split hasGutter>
        <SplitItem>
          <WarningTriangleIcon size="xl" fill="#f0ab00" />
        </SplitItem>
        <SplitItem>
          <TextContent>
            <Text component={ TextVariants.p }>
              <FormattedMessage
                id="remove-workflow-modal"
                defaultMessage={ `Removing {count, number} {count, plural,
              one {approval process}
              other {approval processes}
            }` }
                values={ {
                  count: workflowId ? 1 : ids.length
                } }
              />
            </Text>
          </TextContent>
        </SplitItem>
      </Split>
    </Modal>
  );
};

RemoveWorkflowModal.propTypes = {
  removeWorkflows: PropTypes.func.isRequired,
  removeWorkflow: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  setSelectedWorkflows: PropTypes.func.isRequired,
  ids: PropTypes.array
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  removeWorkflow,
  removeWorkflows
}, dispatch);

export default connect(null, mapDispatchToProps)(RemoveWorkflowModal);
