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
      columns: [],
      fetchData: () => new Promise(resolve => resolve([])),
      pagination: {
        limit: 50,
        offset: 0,
        count: 51
      }
    };
  });

  it('should display the table', async done => {
    let wrapper;
    const rows = [{
      id: 1,
      cells: [ 'name', 'description' ]
    }];

    await act(async() => {
      wrapper = mount(
        <TableToolbarView
          { ...initialProps }
          columns={ [{ title: 'Name', cellFormatters: [ expandable ]}, 'Description' ] }
          rows={ rows }
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
