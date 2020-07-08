import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Modal, Button, Text, TextContent, TextVariants, Spinner, Title } from '@patternfly/react-core';
import { FormattedMessage, useIntl } from 'react-intl';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { removeWorkflow, removeWorkflows, fetchWorkflow } from '../../redux/actions/workflow-actions';
import useQuery from '../../utilities/use-query';
import routes from '../../constants/routes';
import useWorkflow from '../../utilities/use-workflows';
import { FormItemLoader } from '../../presentational-components/shared/loader-placeholders';

const RemoveWorkflowModal = ({
  ids = [],
  fetchData,
  setSelectedWorkflows
}) => {
  const dispatch = useDispatch();
  const [ fetchedWorkflow, setFetchedWorkflow ] = useState();
  const [ submitting, setSubmitting ] = useState(false);
  const { push } = useHistory();
  const [{ workflow: workflowId }] = useQuery([ 'workflow' ]);

  const finalId = workflowId || ids.length === 1 && ids[0];

  const intl = useIntl();
  const workflow = useWorkflow(finalId);

  useEffect(() => {
    if (finalId && !workflow) {
      dispatch(fetchWorkflow(finalId))
      .then(({ value }) => setFetchedWorkflow(value))
      .catch(() => push(routes.workflows.index));
    }
  }, []);

  if (!finalId && ids.length === 0) {
    return null;
  }

  const removeWf = () =>(finalId ? dispatch(removeWorkflow(finalId)) : dispatch(removeWorkflows(ids)))
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
      isOpen
      variant="small"
      aria-label={
        intl.formatMessage({
          id: 'remove-workflow-modal-title-aria-label',
          defaultMessage: `Delete {count, plural, one {approval process} other {approval processes}} modal`
        },
        { count: finalId ? 1 : ids.length })
      }
      width={ '40%' }
      header={
        <Title size="2xl" headingLevel="h1">
          <ExclamationTriangleIcon size="sm" fill="#f0ab00" className="pf-u-mr-sm" />
          <FormattedMessage
            id="remove-workflow-modal-title"
            defaultMessage={ `Delete {count, plural, one {approval process} other {approval processes}}?` }
            values={ { count: finalId ? 1 : ids.length } }
          />
        </Title>
      }
      onClose={ onCancel }
      actions={ [
        <Button id="submit-remove-workflow" key="submit" variant="danger" type="button" isDisabled={ submitting } onClick={ onSubmit }>
          { submitting
            ? <React.Fragment><Spinner size="sm" /> <FormattedMessage id="deleting" defaultMessage="Deleting" /> </React.Fragment>
            : <FormattedMessage id="delete" defaultMessage="Delete" />
          }
        </Button>,
        <Button id="cancel-remove-workflow" key="cancel" variant="link" type="button" isDisabled={ submitting } onClick={ onCancel }>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      ] }
    >
      <TextContent>
        <Text component={ TextVariants.p }>
          {
            (finalId && !workflow && !fetchedWorkflow)
              ? <FormItemLoader/>
              : <FormattedMessage
                id="remove-workflow-modal-text-single"
                defaultMessage={ `{name} will be removed.` }
                values={ {
                  name: <b>{
                    finalId
                      ? fetchedWorkflow && fetchedWorkflow.name || workflow && workflow.name
                      : (<React.Fragment>
                        { ids.length }&nbsp;
                        <FormattedMessage id="approval-processes" defaultMessage="approval processes"/>
                      </React.Fragment>)

                  }</b>
                } }
              />
          }
        </Text>
      </TextContent>
    </Modal>
  );
};

RemoveWorkflowModal.propTypes = {
  fetchData: PropTypes.func.isRequired,
  setSelectedWorkflows: PropTypes.func.isRequired,
  ids: PropTypes.array
};

export default RemoveWorkflowModal;
