import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Label, Flex, FlexItem, Stack, StackItem, Button, Checkbox } from '@patternfly/react-core';
import { AngleUpIcon, AngleDownIcon } from '@patternfly/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import WorkflowTableContext from './workflow-table-context';
import worfklowMessages from '../../messages/workflows.messages';
import { updateWorkflow, fetchWorkflows, moveSequence } from '../../redux/actions/workflow-actions';
import asyncDebounce from '../../utilities/async-debounce';

const debouncedFunctionsCache = {};

const debouncedMove = (id) => {
  if (debouncedFunctionsCache[id]) {
    return debouncedFunctionsCache[id];
  }

  debouncedFunctionsCache[id] = asyncDebounce(
    (workflow, dispatch, intl) => dispatch(updateWorkflow(workflow, intl))
    .then(() => dispatch(fetchWorkflows())),
    1500
  );

  return debouncedFunctionsCache[id];
};

export const MoveButtons = ({ id, sequence }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const { isUpdating, direction, property } = useSelector(
    ({ workflowReducer: { isUpdating, isLoading, sortBy: { direction, property }}}) => (
      { isUpdating: isUpdating > 0 || isLoading, direction, property }
    )
  );

  const move = debouncedMove(id);

  const updateSequence = (sequence) => {
    dispatch(moveSequence({ id, sequence }));

    return move({ id, sequence }, dispatch, intl);
  };

  if (property !== 'sequence') {
    return null;
  }

  return (
    <Stack>
      <StackItem>
        <Button
          variant="plain"
          aria-label={ intl.formatMessage(worfklowMessages.up) }
          id={ `up-${id}` }
          onClick={ () => updateSequence(direction === 'asc' ? sequence - 1 : sequence + 1) }
          isDisabled={ direction === 'asc' && sequence === 1 || isUpdating }
        >
          <AngleUpIcon />
        </Button>
      </StackItem>
      <StackItem>
        <Button
          variant="plain"
          aria-label={ intl.formatMessage(worfklowMessages.down) }
          id={ `down-${id}` }
          onClick={ () => updateSequence(direction === 'asc' ? sequence + 1 : sequence - 1) }
          isDisabled={ direction === 'desc' && sequence === 1 || isUpdating }
        >
          <AngleDownIcon />
        </Button>
      </StackItem>
    </Stack>
  );
};

MoveButtons.propTypes = {
  id: PropTypes.string.isRequired,
  sequence: PropTypes.number.isRequired
};

export const GroupsLabels = ({ group_refs, id }) => (
  <Flex key={ id } className="pf-u-mt-sm">
    { group_refs.map(({ name, uuid }) => (
      <FlexItem key={ uuid }>
        <Label className="group-label pf-u-mb-sm">
          { name }
        </Label>
      </FlexItem>
    )) }
  </Flex>
);

GroupsLabels.propTypes = {
  id: PropTypes.string,
  group_refs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired
  }))
};

export const SelectBox = ({ id }) => {
  const { selectedWorkflows, setSelectedWorkflows } = useContext(WorkflowTableContext);

  return (
    <Checkbox
      id={ `select-${id}` }
      isChecked={ selectedWorkflows.includes(id) }
      onChange={ () => setSelectedWorkflows(id) }
    />
  );
};

SelectBox.propTypes = {
  id: PropTypes.string.isRequired
};

export const createRows = (data) => data.map((
  {
    id,
    name,
    description,
    sequence,
    group_refs
  }
) => ({
  id,
  cells: [
    <React.Fragment key={ `${id}-buttons` }>
      <MoveButtons id={ id } sequence={ sequence } />
    </React.Fragment>,
    <React.Fragment key={ `${id}-checkbox` }>
      <SelectBox id={ id } />
    </React.Fragment>,
    sequence,
    name,
    description,
    <React.Fragment key={ id }>
      <GroupsLabels key={ id } group_refs={ group_refs } id={ id } />
    </React.Fragment>
  ]
})
);
