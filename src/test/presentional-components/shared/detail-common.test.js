import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import ItemDetails from '../../../presentational-components/shared/detail-common';

describe('<ItemDetails />', () => {
  it('should render correctly', () => {
    const wrapper = mount(
      <ItemDetails
        toDisplay={ [ 'foo', 'bar' ] }
        foo="Foo prop"
        bar="Bar prop"
        baz="Should not be rendered"
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
