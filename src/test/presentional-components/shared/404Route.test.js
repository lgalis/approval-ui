import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NoMatch from '../../../PresentationalComponents/shared/404Route';

describe('<NoMatch />', () => {
  it('should render correctly', () => {
    expect(toJson(mount(<NoMatch />))).toMatchSnapshot();
  });
});
