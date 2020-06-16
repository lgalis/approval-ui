const path = require('path');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true
});

const entry = process.env.NODE_ENV === 'production' ?
  path.resolve(__dirname, '../src/entry.js') :
  path.resolve(__dirname, '../src/entry-dev.js');

const { insights } = require('../package.json');

let appDeploy = 'apps';
// TO DO remove once ansible is available outside of beta. Or we can always develop on beta
if (process.env.BETA === 'true') {
  appDeploy = 'beta/apps';
}

const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
const betaBranch =
gitBranch === 'master' ||
gitBranch === 'ci-beta' ||
gitBranch === 'qa-beta' ||
gitBranch === 'prod-beta';
if (process.env.NODE_ENV === 'production' && betaBranch) {
  appDeploy = 'beta/apps';
}

const publicPath = `/${appDeploy}/${insights.appname}/`;

module.exports = {
  paths: {
    entry,
    public: path.resolve(__dirname, '../dist'),
    publicPath
  },
  appDeploy
};
