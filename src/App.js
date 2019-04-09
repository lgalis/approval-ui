import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import AppTabs from './smart-components/app-tabs/app-tabs';
import { Main, PageHeader } from '@red-hat-insights/insights-frontend-components';
import { Title } from '@patternfly/react-core';
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
        <PageHeader>
          <Title size={ 'xl' }  style = { { margin: 12, padding: 12 } }>
            Approval
          </Title>
        </PageHeader>
        <Main style={ { backgroundColor: 'd3d3d3', margin: '0', padding: '0' } }>
          <AppTabs>
            <Routes childProps={ this.props } />
          </AppTabs>
        </Main>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default withRouter (connect()(App));
