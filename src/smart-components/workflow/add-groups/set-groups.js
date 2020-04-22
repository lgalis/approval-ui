import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import asyncDebounce from '../../../utilities/async-debounce';
import { fetchFilterApprovalGroups } from '../../../helpers/group/group-helper';
import { WorkflowInfoFormLoader } from '../../../presentational-components/shared/loader-placeholders';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  StackItem,
  Title
} from '@patternfly/react-core';
import { fetchRbacApprovalGroups } from '../../../redux/actions/group-actions';

const SetGroups = ({ formData, handleChange, title }) => {
  const [ isExpanded, setExpanded ] = useState(false);
  const [ groupValues, setGroupValues ] = useState([]);
  const [ inputValue, setInputValue ] = useState([]);
  const [ isFetching, setIsFetching ] = useState([]);

  const defaultOptions = useSelector(({ groupReducer: { groups }}) => groups || []);

  const onInputChange = (newValue) => {
    const value = newValue.replace(/\W/g, '');
    setInputValue(value);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    setIsFetching(true);
    dispatch(
      fetchRbacApprovalGroups()).then(() => setIsFetching(false));
  }, []);

  useEffect(() => {
    setGroupValues(formData.wfGroups ? formData.wfGroups : []);
  }, [ formData.wfGroups ]);

  const onToggle = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const onGroupChange = (values) => {
    setGroupValues(values);
    handleChange({ wfGroups: values });
  };

  return (
    <Fragment>
      <Stack gutter="md">
        <StackItem key={ 'title' }>
          <Title size="md">{ title || 'Set groups' }</Title>
        </StackItem>
        <StackItem key={ 'group' }>
          { isFetching && <WorkflowInfoFormLoader/> }
          { !isFetching &&
              <AsyncSelect
                cacheOptions
                isClearable
                isMulti
                styles={ { menuPortal: base => ({ ...base, zIndex: 9999 }) } }
                menuPortalTarget={ document.body }
                menuPosition={ 'fixed' }
                menuPlacement={ 'bottom' }
                label={ 'Group' }
                aria-label={ 'Group' }
                onToggle={ onToggle }
                key={ `groups` }
                onChange={ (e) => onGroupChange(e) }
                value={ groupValues }
                inpuValue={ inputValue }
                isexpanded={ isExpanded }
                loadOptions={ asyncDebounce(fetchFilterApprovalGroups) }
                defaultOptions={ defaultOptions }
                onInputChange={ (e) => onInputChange(e) }
              /> }
        </StackItem>
      </Stack>
    </Fragment>
  );
};

SetGroups.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  formData: PropTypes.object,
  handleChange: PropTypes.func
};

export default SetGroups;
