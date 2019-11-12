import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Table, TableHeader, TableBody, expandable } from '@patternfly/react-table';

import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { DataListLoader } from '../../presentational-components/shared/loader-placeholders';

describe('<TableToolbarView />', () => {
  let initialProps;

  beforeEach(() => {
    initialProps = {
      createRows: () => [],
      request: () => new Promise(resolve => resolve([])),
      columns: [],
      fetchData: () => new Promise(resolve => resolve([])),
      data: [],
      pagination: {
        limit: 50,
        offset: 0,
        count: 51
      }
    };
  });

  it('should mount correctly', async done => {
    let wrapper;

    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } />);
    });
    expect(wrapper.find(Table)).toHaveLength(1);
    expect(wrapper.find(TableHeader)).toHaveLength(1);
    expect(wrapper.find(TableBody)).toHaveLength(1);
    done();
  });

  it('should mount correctly in loading state', async done => {
    let wrapper;

    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } isLoading />);
    });
    expect(wrapper.find(Table)).toHaveLength(0);
    expect(wrapper.find(DataListLoader)).toHaveLength(1);
    done();
  });

  it('should call filtering callback', async done => {
    const setFilterValue = jest.fn();
    let wrapper;

    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } setFilterValue={ setFilterValue } />);
    });
    const input = wrapper.find('input').first();
    input.getDOMNode().value = 'foo';
    input.simulate('change');
    expect(setFilterValue).toHaveBeenCalledWith('foo');
    done();
  });

  it('should select row correctly', async done => {
    const setCheckedItems = jest.fn();
    let wrapper;
    const createRows = () => [{
      id: 1,
      cells: [ 'name', 'description' ]
    }];

    await act(async() => {
      wrapper = mount(
        <TableToolbarView
          { ...initialProps }
          columns={ [{ title: 'Name', cellFormatters: [ expandable ]}, 'Description' ] }
          createRows={ createRows }
          isSelectable
          setCheckedItems={ setCheckedItems }
        />);
    });

    act(() => {
      wrapper.update();
    });

    expect(wrapper.find('tr')).toHaveLength(2);
    wrapper.find('input[type="checkbox"]').last().simulate('change');
    expect(setCheckedItems).toHaveBeenCalledWith([{ cells: [ 'name', 'description' ], id: 1, selected: true }]);
    done();
  });

  it('should select all rows correctly', async done => {
    const setCheckedItems = jest.fn();
    let wrapper;
    const createRows = () => [{
      id: 1,
      cells: [ 'name - 1', 'description - 1' ]
    }, {
      id: 2,
      cells: [ 'name - 2', 'description' ]
    }];

    await act(async() => {
      wrapper = mount(
        <TableToolbarView
          { ...initialProps }
          columns={ [{ title: 'Name', cellFormatters: [ expandable ]}, 'Description' ] }
          createRows={ createRows }
          isSelectable
          setCheckedItems={ setCheckedItems }
        />);
    });

    act(() => {
      wrapper.update();
    });

    expect(wrapper.find('tr')).toHaveLength(3);
    wrapper.find('input[type="checkbox"]').first().simulate('change');
    expect(setCheckedItems).not.toHaveBeenCalled();
    done();
  });

  it('should expand row correctly', async done => {
    let wrapper;
    const createRows = () => [{
      id: 1,
      isOpen: false,
      cells: [ 'name - 1', 'description - 1' ]
    }, {
      id: 2,
      parent: 1,
      cells: [ 'name - 2', 'description' ]
    }];

    await act(async() => {
      wrapper = mount(
        <TableToolbarView
          { ...initialProps }
          columns={ [{ title: 'Name', cellFormatters: [ expandable ]}, 'Description' ] }
          createRows={ createRows }
        />);
    });

    act(() => {
      wrapper.update();
    });

    const expandableRow = wrapper.find('.pf-c-table__expandable-row');
    expect(expandableRow.props().hidden).toEqual(true);
    expect(wrapper.find('button.pf-c-button').last().props().className).toEqual('pf-c-button pf-m-plain');
    wrapper.find('button.pf-c-button').last().simulate('click');

    act(() => {
      wrapper.update();
    });
    expandableRow.update();
    expect(wrapper.find('button.pf-c-button').last().props().className).toEqual('pf-c-button pf-m-plain pf-m-expanded');
    done();
  });

  it('should send async requests on pagination', async done => {
    const request = jest.fn().mockImplementation(() => new Promise(resolve => resolve([])));
    let wrapper;

    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } request={ request } />);
    });

    const paginationInput = wrapper.find('input[type="number"]').last();
    paginationInput.getDOMNode().value = 2;
    paginationInput.simulate('change');
    await act(async() => {
      paginationInput.simulate('keypress', { key: 'Enter' });
    });

    setTimeout(() => {
      expect(request).toHaveBeenCalledWith();
      done();
    }, 251);
  });
});
