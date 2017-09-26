# oidc-web
OIDC (OpenID Connect) authentication client for web browsers (Relying Party wrapper)


# OpenID Connect Web Client _(@trust/oidc-web)_

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Build Status](https://travis-ci.org/anvilresearch/oidc-web.svg?branch=master)](https://travis-ci.org/anvilresearch/oidc-web)
[![codecov](https://codecov.io/gh/anvilresearch/oidc-web/branch/master/graph/badge.svg)](https://codecov.io/gh/anvilresearch/oidc-web)

>  OIDC (OpenID Connect) authentication client for web browsers (Relying Party wrapper)

Authentication client for use in browser-based JS applications.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Background

## Install

```
$ npm install @trust/oidc-web
```

## Usage

```js
const { OIDCWebClient } = require('@trust/oidc-web')

let auth = new OIDCWebClient({})

auth.login(issuer)
  .then(session => {
    // logged in session or null
  })

// On Document Ready (or on web framework ready) event:

auth.currentSession()
  .then(session => {
    if (session) {
      // logged in
    } else {
      console.log('please log in')
    }
  })
```

## Develop

### Install

```bash
git clone https://github.com/anvilresearch/oidc-web.git
cd oidc-web
npm install
```

### Test

```
$ npm test
```

### Coverage

```
$ npm run coverage
```

## API

## Contribute

### Issues

* please file [issues](https://github.com/anvilresearch/oidc-web/issues) :)
* for bug reports, include relevant details such as platform, version, relevant data, and stack traces
* be sure to check for existing issues before opening new ones
* read the documentation before asking questions
* it's strongly recommended to open an issue before hacking and submitting a PR
* we reserve the right to close an issue for excessive bikeshedding

### Pull requests

#### Policy

* we're not presently accepting *unsolicited* pull requests
* create an issue to discuss proposed features before submitting a pull request
* create an issue to propose changes of code style or introduce new tooling
* ensure your work is harmonious with the overall direction of the project
* ensure your work does not duplicate existing effort
* keep the scope compact; avoid PRs with more than one feature or fix
* code review with maintainers is required before any merging of pull requests
* new code must respect the style guide and overall architecture of the project
* be prepared to defend your work

#### Style guide

* [Conventional Changelog](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md)
* Standard JavaScript (and corresponding editor configs)
* ES6
* jsdocs

#### Code reviews

* required before merging PRs
* reviewers MUST run and test the code under review

### Collaborating

This project is part of a greater group of projects visible [here](https://www.npmjs.com/org/trust) at the @trust organisation on NPM.

#### Pair programming

* Required for new contributors
* Work directly with one or more members of the core development team

### Code of conduct

* @trust/model follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

## Maintainers

* [@dmitrizagidulin](https://github.com/dmitrizagidulin)

## License

MIT © 2017 MIT Trust Consortium
