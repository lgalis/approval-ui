import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import mock, { once } from 'xhr-mock';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;

/**
 * Setup mock of tests
 */
mock.setup();
global.mockOnce = once;
global.apiClientMock = mock;

/**
 * setup ENV vars
 */
process.env.BASE_PATH = '/api';

/**
 * Setup JSDOM
 */
global.SVGPathElement = function () {};

global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

// prepare root element
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
Element.prototype.scrollTo = () => {};

// mock insights instance
global.insights = {
  chrome: {
    auth: {
      getUser: () => new Promise(resolve => resolve(true))
    }
  }
};
