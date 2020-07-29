import React from 'react';
import PropTypes from 'prop-types';
import { Label, Flex, FlexItem } from '@patternfly/react-core';

export const GroupsLabels = ({ group_refs, id }) => (
  <React.Fragment key={ id }>
    <Flex key={ id } className="pf-u-mt-sm">
      { group_refs.map(({ name, uuid }) => (
        <FlexItem key={ uuid }>
          <Label className="group-label pf-u-mb-sm">
            { name }
          </Label>
        </FlexItem>
      )) }
    </Flex>
  </React.Fragment>
);

GroupsLabels.propTypes = {
  id: PropTypes.string,
  group_refs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired
  }))
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
  selected: false,
  cells: [
    sequence,
    name,
    description,
    <GroupsLabels key={ id } group_refs={ group_refs } id={ id } />
  ]
})
);
