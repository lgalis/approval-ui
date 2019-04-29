import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import { Main } from '@red-hat-insights/insights-frontend-components';
import { NotificationsPortal } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import '@red-hat-insights/insights-frontend-components/components/Notifications.css';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';

class App extends Component {
  state = {
    chromeNavAvailable: true,
    auth: false
  }

  componentDidMount () {
    insights.chrome.init();
    insights.chrome.auth.getUser().then(() => this.setState({ auth: true }));
    insights.chrome.identifyApp('approval');
  }

  render () {
    const { auth } = this.state;
    if (!auth) {
      return <AppPlaceholder />;
    }

    return (
      <React.Fragment>
        <NotificationsPortal />
        <Main>
          <Routes />
        </Main>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default withRouter (connect()(App));
