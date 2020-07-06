import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Table, TableHeader, TableBody, expandable } from '@patternfly/react-table';
import { IntlProvider } from 'react-intl';

import { TableToolbarView as TableToolbarViewOriginal } from '../../presentational-components/shared/table-toolbar-view';
import { DataListLoader } from '../../presentational-components/shared/loader-placeholders';

describe('<TableToolbarView />', () => {
  let initialProps;

  const TableToolbarView = (props) => (<IntlProvider locale="en">
    <TableToolbarViewOriginal { ...props } />
  </IntlProvider>);

  beforeEach(() => {
    initialProps = {
      createRows: () => [],
      rows: [],
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

  it('should display the table', async done => {
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
        />);
    });

    act(() => {
      wrapper.update();
    });
    expect(wrapper.find(Table)).toHaveLength(1);
    expect(wrapper.find(TableHeader)).toHaveLength(1);
    expect(wrapper.find(TableBody)).toHaveLength(1);
    done();
  });

  it('should display the empty state', async done => {
    let wrapper;
    const renderEmptyState = jest.fn();
    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } isLoading={ false } renderEmptyState={ renderEmptyState } />);
    });

    act(() => {
      wrapper.update();
    });

    expect(renderEmptyState).toHaveBeenCalled();
    expect(wrapper.find(Table)).toHaveLength(0);
    expect(wrapper.find(TableHeader)).toHaveLength(0);
    expect(wrapper.find(TableBody)).toHaveLength(0);
    done();
  });

  it('should mount correctly in loading state', async done => {
    let wrapper;

    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } isLoading={ true } />);
    });
    expect(wrapper.find(Table)).toHaveLength(0);
    expect(wrapper.find(DataListLoader)).toHaveLength(1);
    done();
  });

  it('should call filtering callback', async done => {
    const onFilterChange = jest.fn();
    let wrapper;

    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } onFilterChange={ onFilterChange } />);
    });
    const input = wrapper.find('input').first();
    input.getDOMNode().value = 'foo';
    input.simulate('change');
    expect(onFilterChange).toHaveBeenCalledWith('foo');
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

  it('should select all rows correctly', async () => {
    const setCheckedItems = jest.fn();
    let wrapper;

    const data = [{
      id: 1,
      cells: [ 'name - 1', 'description - 1' ],
      selected: false
    }, {
      id: 2,
      cells: [ 'name - 2', 'description' ],
      selected: false
    }];

    const createRows = (data) => data;

    await act(async() => {
      wrapper = mount(
        <TableToolbarView
          { ...initialProps }
          data={ data }
          columns={ [{ title: 'Name', cellFormatters: [ expandable ]}, 'Description' ] }
          createRows={ createRows }
          isSelectable
          setCheckedItems={ setCheckedItems }
          canSelectAll={ true }
        />);
    });
    wrapper.update();

    expect(wrapper.find('tr')).toHaveLength(3);

    await act(async () => {
      wrapper.find('input[type="checkbox"]').first().getDOMNode().checked = true;
      wrapper.find('input[type="checkbox"]').first().simulate('change', { target: { checked: true }});
    });

    expect(setCheckedItems).toHaveBeenCalledWith(data.map(d => ({ ...d, selected: true })));
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
    expect(wrapper.find('button.pf-c-button').last().props().className).toEqual('pf-c-button pf-m-plain');
    done();
  });

  it('should expand row correctly with custom onCollapse', async () => {
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

    const onCollapseSpy = jest.fn().mockImplementation((id, setRows, setOpen) => setRows((rows) => setOpen(rows, id)));

    await act(async() => {
      wrapper = mount(
        <TableToolbarView
          { ...initialProps }
          columns={ [{ title: 'Name', cellFormatters: [ expandable ]}, 'Description' ] }
          createRows={ createRows }
          onCollapse={ onCollapseSpy }
        />);
    });
    wrapper.update();

    const expandableRow = wrapper.find('.pf-c-table__expandable-row');

    expect(expandableRow.props().hidden).toEqual(true);
    expect(wrapper.find('button.pf-c-button').last().props().className).toEqual('pf-c-button pf-m-plain');

    await act(async () => {
      wrapper.find('button.pf-c-button').last().simulate('click');
    });
    wrapper.update();

    expandableRow.update();
    expect(wrapper.find('button.pf-c-button').last().props().className).toEqual('pf-c-button pf-m-plain');
  });

  it('should send async requests on pagination', async done => {
    const request = jest.fn().mockImplementation(() => new Promise(resolve => resolve([])));
    let wrapper;

    await act(async() => {
      wrapper = mount(<TableToolbarView { ...initialProps } fetchData={ request } />);
    });

    const paginationInput = wrapper.find('button').last();

    await act(async() => {
      paginationInput.simulate('click');
    });

    setTimeout(() => {
      expect(request).toHaveBeenCalledWith({ count: 51, limit: 50, offset: 50 });
      done();
    }, 251);
  });
});
