/*global module, process*/

module.exports = {
  routes: {
    '/hybrid/catalog/approval': { host: `http://localhost:8002` },
    '/apps/approval': { host: `http://localhost:8002` }
  }
};
