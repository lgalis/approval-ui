# Insights Approval Service UI

[![Build Status](https://travis-ci.org/RedHatInsights/approval-ui.svg?branch=master)](https://travis-ci.org/RedHatInsights/approval-ui)
[![codecov](https://codecov.io/gh/RedHatInsights/approval-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/approval-ui)

## Getting Started

### Insights Proxy
[Insights Proxy](https://github.com/RedHatInsights/insights-proxy) is required to run the RBAC frontend application. 
To run the proxy with approval-specific configuration run:
```
SPANDX_CONFIG="$(pwd)/approval-ui/config/spandx.config.js" bash insights-proxy/scripts/run.sh

## License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
