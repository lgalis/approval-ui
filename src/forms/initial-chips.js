/* eslint-disable react/prop-types */
import React from 'react';
import { Chip, ChipGroup, FormGroup } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';

const InitialChips = ({ name, label }) => {
  const {
    input: { value, onChange }
  } = useFieldApi({ name });

  const handleRemove = (id) => {
    console.log('debug handleRemove: id, value', id, value);
    onChange(value.filter((item) => item.value !== id));
    if (value?.length === 0) {
      return null;
    }
  };

  console.log('Initial chips: value, name, label', value, name, label);
  return (
    <FormGroup fieldId={ name } label={ label }>
      <ChipGroup>
        { value.map(({ label, value }) => (
          <Chip key={ value.value } onClick={ () => handleRemove(value) }>
            { label }
          </Chip>
        )) }
      </ChipGroup>
    </FormGroup>
  );
};

export default InitialChips;
