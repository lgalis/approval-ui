import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';

import { Routes } from './Routes';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
import { SET_OPENAPI_SCHEMA, SET_USER_ACCESS } from './redux/action-types';

import 'whatwg-fetch';

// react-int eng locale data
import { IntlProvider } from 'react-intl';

import '@redhat-cloud-services/frontend-components-notifications/index.css';
import '@redhat-cloud-services/frontend-components/index.css';
import { getAxiosInstance, getRbacRoleApi } from './helpers/shared/user-login';
import { APPROVAL_API_BASE } from './utilities/constants';

const App = () => {
  const [ auth, setAuth ] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    insights.chrome.init();
    Promise.all([
      getAxiosInstance()
      .get(`${APPROVAL_API_BASE}/openapi.json`)
      .then((payload) => dispatch({ type: SET_OPENAPI_SCHEMA, payload })),
      getRbacRoleApi()
      .getRoles({ scope: 'principal' })
      .then(({ data }) =>
        dispatch({
          type: SET_USER_ACCESS,
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
          <Routes />
        </Main>
      </React.Fragment>
    </IntlProvider>
  );
};

export default App;
