# Insights Approval Service UI

[![Build Status](https://travis-ci.org/RedHatInsights/approval-ui.svg?branch=master)](https://travis-ci.org/RedHatInsights/approval-ui)
[![Maintainability](https://api.codeclimate.com/v1/badges/c71ac50e128317623274/maintainability)](https://codeclimate.com/github/RedHatInsights/approval-ui/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c71ac50e128317623274/test_coverage)](https://codeclimate.com/github/RedHatInsights/approval-ui/test_coverage)

## Getting Started

### Insights Proxy
[Insights Proxy](https://github.com/RedHatInsights/insights-proxy) is required to run the RBAC frontend application. 
To run the proxy with approval-specific configuration run:
```
SPANDX_CONFIG="$(pwd)/approval-ui/config/spandx.config.js" bash insights-proxy/scripts/run.sh

## License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
