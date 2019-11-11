import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import Stage from '../../../../smart-components/request/request-detail/stage';

const ComponentWrapper = ({ children }) => (
  <MemoryRouter initialEntries={ [ '/foo' ] }>
    { children }
  </MemoryRouter>
);

describe('<Stage />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      isExpanded: false,
      toggleExpand: jest.fn(),
      item: {
        id: 'item-id',
        state: 'no-state',
        request_id: 'request-id',
        stageActions: {
          data: []
        }
      }
    };
  });

  it('should render correctly', () => {
    const wrapper = mount(<ComponentWrapper><Stage { ...initialProps } /></ComponentWrapper>).find(Stage);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render item in active state with link', () => {
    const wrapper = mount(
      <ComponentWrapper>
        <Stage
          { ...initialProps }
          item={ {
            id: 'item-id',
            state: 'notified',
            request_id: 'request-id',
            stageActions: {
              data: []
            }
          } }
          isActive
        />
      </ComponentWrapper>
    );
    wrapper.update();
    expect(wrapper.find('a#approve-request-id')).toHaveLength(1);
    expect(wrapper.find('a#deny-request-id')).toHaveLength(1);

    wrapper.find('Link#approve-request-id').simulate('click', { button: 0 });
    wrapper.update();
    const history = wrapper.find(MemoryRouter).instance().history;
    expect(history.location.pathname).toEqual('/requests/detail/request-id/approve');
    wrapper.find('Link#deny-request-id').simulate('click', { button: 0 });
    expect(history.location.pathname).toEqual('/requests/detail/request-id/deny');
  });

  it('should expand item', () => {
    const toggleExpand = jest.fn();
    const wrapper = mount(
      <ComponentWrapper>
        <Stage
          { ...initialProps }
          item={ {
            id: 'item-id',
            state: 'notified',
            request_id: 'request-id',
            stageActions: {
              data: []
            }
          } }
          isActive
          toggleExpand={ toggleExpand }
        />
      </ComponentWrapper>
    );
    wrapper.update();
    wrapper.find('button.pf-c-button.pf-m-plain').simulate('click');
    wrapper.update();
    expect(toggleExpand).toHaveBeenCalledWith('stage-item-id');
  });

  it('should expand kebab menu', () => {
    const toggleExpand = jest.fn();
    const wrapper = mount(
      <ComponentWrapper>
        <Stage
          { ...initialProps }
          item={ {
            id: 'item-id',
            state: 'notified',
            request_id: 'request-id',
            stageActions: {
              data: []
            }
          } }
          isActive
          toggleExpand={ toggleExpand }
        />
      </ComponentWrapper>
    );
    wrapper.update();
    wrapper.find('#stage-request-dropdown-request-id').first().simulate('click');
    wrapper.update();
    wrapper.find('Link#stage-request-id-request-comment').first().simulate('click', { button: 0 });
    wrapper.update();
  });
});
