import React from 'react';
import { mount as enzymeMount } from 'enzyme';
import { MemoryRouter, Link } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Button } from '@patternfly/react-core';

import RequestActions from '../../../smart-components/request/request-actions';

const mount = (children) => enzymeMount(
  <MemoryRouter>
    <IntlProvider locale="en">
      { children }
    </IntlProvider>
  </MemoryRouter>
);

describe('<RequestActions />', () => {
  const initialProps = {
    denyLink: '/deny',
    approveLink: '/approve',
    commentLink: '/comment',
    request: {
      id: '1234',
      state: 'notified'
    }
  };

  it('renders correctly', () => {
    const wrapper = mount(<RequestActions
      { ...initialProps }
    />);

    expect(wrapper.find(Link)).toHaveLength(3);
    expect(wrapper.find(Button)).toHaveLength(3);

    expect(wrapper.find('a').at(0).props().href).toEqual(`${initialProps.approveLink}?request=${initialProps.request.id}`);
    expect(wrapper.find('a').at(1).props().href).toEqual(`${initialProps.denyLink}?request=${initialProps.request.id}`);
    expect(wrapper.find('a').at(2).props().href).toEqual(`${initialProps.commentLink}?request=${initialProps.request.id}`);
  });

  it('cannot approve and deny', () => {
    const wrapper = mount(<RequestActions
      { ...initialProps }
      canApproveDeny={ false }
    />);

    expect(wrapper.find(Link)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(3);
  });

  it('cannot comment', () => {
    const wrapper = mount(<RequestActions
      { ...initialProps }
      canComment={ false }
    />);

    expect(wrapper.find(Link)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(3);
  });

  it('cannot do anything comment', () => {
    const wrapper = mount(<RequestActions
      { ...initialProps }
      canComment={ false }
      canApproveDeny={ false }
    />);

    expect(wrapper.find(Link)).toHaveLength(0);
    expect(wrapper.find(Button)).toHaveLength(3);
  });
});
