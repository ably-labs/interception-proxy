# Interception Proxy

Web service to create proxies for intercepting and manipulating WebSocket traffic between an Ably client library and the Realtime service. Very much a prototype and a work in progress (see the abundant TODOs in the code). The motivation for this work is currently best described by [this internal RFC](https://ably.atlassian.net/wiki/x/IYDItQ).

## Requirements

- Node LTS — I tested on 20
- Python 3.x — I tested on 3.12.4
- mitmproxy ([PyPi](https://pypi.org/project/mitmproxy/)) — I tested on 10.3.1
- websockets ([PyPi](https://pypi.org/project/websockets/)) — I tested on 12.0

## Installation

There are currently no NPM releases of this package, so you’ll need to install it directly from the Git repo:

```bash
npm install https://github.com/ably-labs/interception-proxy
```

## Commands

### Setup

- `npx --package interception-proxy generate-mitmproxy-certs`: Generates the mitmproxy TLS certificate, so that you can add it to the trust store used by the process under test.

### Running locally

- `npx interception-proxy`: Starts the interception proxy. Use this when running in a local development environment.

### Running in CI

- `npx --package interception-proxy start-service`: Starts the interception proxy as a background service. Useful for CI. The script uses `sudo` so it’s probably not something you want to use locally.

## JSON-RPC API

See [`docs/API.md`](docs/API.md).

## Examples

Currently the best example of how to use this server is https://github.com/ably/ably-js/pull/1816.
