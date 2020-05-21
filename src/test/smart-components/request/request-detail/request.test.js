import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';
import { Request } from '../../../../smart-components/request/request-detail/request';
import routes from '../../../../constants/routes';

const ComponentWrapper = ({ children }) => (
  <MemoryRouter initialEntries={ [ '/foo' ] }>
    { children }
  </MemoryRouter>
);

describe('<Request />', () => {
  let initialProps;
  beforeEach(() => {
    initialProps = {
      isExpanded: false,
      toggleExpand: jest.fn(),
      item: {
        id: '111',
        group_name: 'Group',
        state: 'notified',
        metadata: {
          user_capabilities: { approve: true, deny: true }
        },
        actions: [
          {
            id: '1',
            operation: 'start',
            comments: null,
            created_at: '2020-01-29T17:08:56.850Z',
            processed_by: 'system'
          },
          {
            id: '2',
            operation: 'notify',
            comments: null,
            created_at: '2020-01-29T17:09:14.994Z',
            processed_by: 'system'
          }
        ]
      }
    };
  });

  it('should render correctly', () => {
    const initialPropsNoDate = {
      isExpanded: false,
      toggleExpand: jest.fn(),
      item: {
        id: '111',
        state: 'no-state',
        metadata: {
          user_capabilities: { approve: true, deny: true }
        },
        actions: [
          {
            id: '1',
            operation: 'start',
            comments: null,
            processed_by: 'system'
          },
          {
            id: '2',
            operation: 'notify',
            comments: null,
            processed_by: 'system'
          }
        ]
      }
    };
    const wrapper = mount(<ComponentWrapper><Request { ...initialPropsNoDate } /></ComponentWrapper>).find(Request);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render item in active state with link', () => {
    const wrapper = mount(
      <ComponentWrapper>
        <Request
          { ...initialProps }
          item={ {
            id: '111',
            state: 'notified',
            group_name: 'Group1',
            metadata: {
              user_capabilities: { approve: true, deny: true }
            },
            actions: [
              {
                id: '1',
                operation: 'start',
                comments: null,
                created_at: '2020-01-29T17:08:56.850Z',
                processed_by: 'system'
              },
              {
                id: '2',
                operation: 'notify',
                comments: null,
                created_at: '2020-01-29T17:09:14.994Z',
                processed_by: 'system'
              }
            ]} }
        />
      </ComponentWrapper>
    );
    wrapper.update();
    expect(wrapper.find('a#approve-111')).toHaveLength(1);
    expect(wrapper.find('a#deny-111')).toHaveLength(1);

    wrapper.find('Link#approve-111').simulate('click', { button: 0 });
    wrapper.update();
    const history = wrapper.find(MemoryRouter).instance().history;
    expect(history.location.pathname).toEqual(routes.request.approve);
    expect(history.location.search).toEqual('?request=111');
    wrapper.find('Link#deny-111').simulate('click', { button: 0 });
    expect(history.location.pathname).toEqual(routes.request.deny);
    expect(history.location.search).toEqual('?request=111');
  });

  it('should expand item', () => {
    const toggleExpand = jest.fn();
    const wrapper = mount(
      <ComponentWrapper>
        <Request
          { ...initialProps }
          item={ {
            id: '111',
            state: 'notified',
            actions: []
          } }
          isActive
          toggleExpand={ toggleExpand }
        />
      </ComponentWrapper>
    );
    wrapper.update();
    wrapper.find('button.pf-c-button.pf-m-plain').simulate('click');
    wrapper.update();
    expect(toggleExpand).toHaveBeenCalledWith('request-111');
  });

  it('should expand kebab menu', () => {
    const toggleExpand = jest.fn();
    const wrapper = mount(
      <ComponentWrapper>
        <Request
          { ...initialProps }
          item={ {
            id: '111',
            state: 'notified',
            metadata: {
              user_capabilities: { approve: true, deny: true, memo: true }
            },
            actions: []
          } }
          isActive
          toggleExpand={ toggleExpand }
        />
      </ComponentWrapper>
    );
    wrapper.update();
    wrapper.find('#request-request-dropdown-111').first().simulate('click');
    wrapper.update();
    wrapper.find('Link#request-111-request-comment').first().simulate('click', { button: 0 });
    wrapper.update();
  });
});
