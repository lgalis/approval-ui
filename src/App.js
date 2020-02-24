import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';
import { Routes } from './Routes';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import { SET_USER_ROLES } from './redux/action-types';
import { defaultSettings } from './helpers/shared/pagination';

import 'whatwg-fetch';

// react-int eng locale data
import { IntlProvider } from 'react-intl';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import '@redhat-cloud-services/frontend-components/index.css';
import { getRbacRoleApi } from './helpers/shared/user-login';

const App = () => {
  const [ auth, setAuth ] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    insights.chrome.init();
    Promise.all([
      getRbacRoleApi()
      .listRoles(defaultSettings.limit, 0, '', 'principal')
      .then(({ data }) =>
        dispatch({
          type: SET_USER_ROLES,
          payload: data
        })
      ),
      insights.chrome.auth.getUser()
    ]).then(() => setAuth(true));

    insights.chrome.identifyApp('approval');
  }, []);

  if (!auth) {
    return <AppPlaceholder />;
  }

  return (
    <IntlProvider locale="en">
      <React.Fragment>
        <NotificationsPortal />
        <Main className="pf-u-p-0 pf-u-ml-0">
          <Routes/>
        </Main>
      </React.Fragment>
    </IntlProvider>
  );
};

export default App;
