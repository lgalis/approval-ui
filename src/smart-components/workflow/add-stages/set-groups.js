import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '../../common/form-renderer';
import { fetchFilterApprovalGroups } from '../../../helpers/group/group-helper';
import { WorkflowInfoFormLoader } from '../../../presentational-components/shared/loader-placeholders';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  StackItem,
  Title
} from '@patternfly/react-core';
import { fetchRbacApprovalGroups } from '../../../redux/actions/group-actions';
import setGroupsSchema from '../../../forms/set_groups_form.schema';

const SetStages = ({ formData, handleChange, title }) => {
  const [ stageValues, setStageValues ] = useState([]);
  const [ isFetching, setIsFetching ] = useState([]);

  const defaultOptions = useSelector(({ groupReducer: { groups }}) => groups || []);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsFetching(true);
    dispatch(
      fetchRbacApprovalGroups()).then(() => setIsFetching(false));
  }, []);

  useEffect(() => {
    setStageValues(formData.wfGroups ? formData.wfGroups : []);
  }, [ formData.wfGroups ]);

  const onStageChange = (value, index) => {
    const values = stageValues;
    values[index] = value;
    setStageValues(values);
    handleChange({ wfGroups: values });
  };

  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem>
          <Title size="md">{ title || 'Set groups' }</Title>
        </StackItem>
        <StackItem>
          { isFetching && <WorkflowInfoFormLoader/> }
          { !isFetching &&
            <FormRenderer
              initialValues={ defaultOptions }
              onSubmit={ onStageChange }
              schema={ setGroupsSchema(fetchFilterApprovalGroups) }
              formContainer="modal"
              buttonsLabels={ { submitLabel: 'Save' } }
            /> }
        </StackItem>
      </Stack>
    </Fragment>
  );
};

SetStages.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  formData: PropTypes.object,
  handleChange: PropTypes.func
};

export default SetStages;
