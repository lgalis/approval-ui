import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NoMatch from '../../../presentational-components/shared/404-route';
import { IntlProvider } from 'react-intl';

describe('<NoMatch />', () => {
  it('should render correctly', () => {
    expect(toJson(mount(<IntlProvider locale="en"><NoMatch /></IntlProvider>))).toMatchSnapshot();
  });
});
