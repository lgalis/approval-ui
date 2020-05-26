import React from 'react';
import { act } from 'react-dom/test-utils';
import App from '../App';
import getStore from '../utilities/store';
import { Provider } from 'react-redux';
import { RBAC_API_BASE } from '../utilities/constants';
import { APPROVAL_ADMINISTRATOR_ROLE } from '../helpers/shared/helpers';
import { AppPlaceholder } from '../presentational-components/shared/loader-placeholders';
import { BrowserRouter } from 'react-router-dom';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';

jest.mock('../Routes', () => ({
  __esModule: true,
  Routes: () => <div id="routes-mock">Here would be routes</div>
}));

describe('<App />', () => {
  let insightsTmp;
  let wrapper;

  beforeEach(() => {
    insightsTmp = global.insights;

    global.insights = {
      chrome: {
        identifyApp: jest.fn(),
        init: jest.fn(),
        auth: {
          getUser: () => Promise.resolve(true)
        }
      }
    };
  });

  afterEach(() => {
    // eslint-disable-next-line require-atomic-updates
    global.insights = insightsTmp;
  });

  it('renders correctly as administrator role', async () => {
    apiClientMock.get(
      `${RBAC_API_BASE}/roles/?limit=50&offset=0&name=Approval%20&scope=principal`,
      mockOnce({ body: {
        data: [{
          role: APPROVAL_ADMINISTRATOR_ROLE
        }]
      }})
    );

    await act(async () => {
      wrapper = mount(
        <Provider store={ getStore() }>
          <App />
        </Provider>
      );
    });

    expect(wrapper.find(AppPlaceholder)).toHaveLength(1);

    wrapper.update();

    expect(wrapper.find(BrowserRouter)).toHaveLength(1);
    expect(wrapper.find(NotificationsPortal)).toHaveLength(1);
    expect(wrapper.find(Main)).toHaveLength(1);
    expect(wrapper.find('#routes-mock')).toHaveLength(1);
  });
});
