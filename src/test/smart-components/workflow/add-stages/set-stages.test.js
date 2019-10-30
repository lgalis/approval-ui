import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SetStages from '../../../../smart-components/workflow/add-stages/set-stages';
import { TrashIcon } from '@patternfly/react-icons';
import AsyncSelect from 'react-select/async';
import { APPROVAL_API_BASE, RBAC_API_BASE } from '../../../../utilities/constants';

describe('<SetStages />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      formData: {
        wfGroups: []
      },
      handleChange: jest.fn(),
      options: [],
      title: 'Set stages test'
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<SetStages { ...initialProps } />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call remove stage callback', () => {
    let wrapper;
    const handleChange = jest.fn();
    act(() => {
      wrapper = mount(
        <SetStages
          { ...initialProps }
          formData={ { wfGroups: [{ id: 'should be in callback' }, { id: 'should not be in callback' }]} }
          handleChange={ handleChange }
        />);
    });
    wrapper.update();

    wrapper.find('button.pf-c-button.pf-m-link').first().simulate('click');
    expect(handleChange).toHaveBeenCalledWith({ wfGroups: [{ id: 'should be in callback' }]});
  });

  it('should call add stage callback', () => {
    let wrapper;
    act(() => {
      wrapper = mount(
        <SetStages
          { ...initialProps }
          formData={ { wfGroups: []} }
        />);
    });
    wrapper.update();

    expect(wrapper.find(TrashIcon)).toHaveLength(0);
    /**
     * Need to add two stages, first can not bet deleted
     */
    wrapper.find('button.pf-c-button.pf-m-link').first().simulate('click');
    wrapper.find('button.pf-c-button.pf-m-link').first().simulate('click');
    wrapper.update();
    expect(wrapper.find(TrashIcon)).toHaveLength(1);
  });

  it('should call onInputChange callback', (done) => {
    let wrapper;
    act(() => {
      wrapper = mount(
        <SetStages
          { ...initialProps }
          formData={ { wfGroups: [{}]} }
        />);
    });
    wrapper.update();

    const selectInput = wrapper.find('input');
    selectInput.getDOMNode().value = 'foo';
    selectInput.simulate('change');
    wrapper.update();
    expect(wrapper.find(AsyncSelect).props().inpuValue).toEqual('foo');
    done();
  });

  it('should call loadOptions request for async select', (done) => {
    expect.assertions(1);
    apiClientMock.get(`${RBAC_API_BASE}/groups/?name=foo`, mockOnce((req, res) => {
      expect(req).toBeTruthy();
      done();
      return res.status(200);
    }));
    let wrapper;
    act(() => {
      wrapper = mount(
        <SetStages
          { ...initialProps }
          formData={ { wfGroups: [{}]} }
        />);
    });
    wrapper.update();

    const selectInput = wrapper.find('input');
    selectInput.getDOMNode().value = 'foo';
    selectInput.simulate('change');
    wrapper.update();
    setTimeout(() => {
      wrapper.update();
    }, 251);
  });

  it('should call handleChange prop', (done) => {
    let wrapper;
    const handleChange = jest.fn();
    act(() => {
      wrapper = mount(
        <SetStages
          { ...initialProps }
          formData={ { wfGroups: [{}]} }
          options={ [{ label: 'foo', value: '1' }] }
          handleChange={ handleChange }
        />);
    });
    wrapper.update();

    wrapper.find(AsyncSelect).props().onChange({ value: '1', label: 'foo' });
    expect(handleChange).toHaveBeenCalledWith({ wfGroups: [{ label: 'foo', value: '1' }]});
    done();
  });
});
