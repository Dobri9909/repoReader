# Repository reader API

[[_TOC_]]

## Summary

This microservice provides support for request/response to github, so we can extract repositories, commits and branch sha`s

## Setup

1. Install project dependencies by running `npm install`.

### For development only

1. Create a file named `.env` with the following contents:

```dotenv
GITHUB_TOKEN=git_hub_token
```

## Environment setup

Current working environment could be changed by setting `NODE_ENV` environment variable. This will cause different configuration
file to be loaded from `config/` directory as well as some additional environment-specific features enablement. Following
values are supported:

* `development` - for local development. This is the default value.
* `testing` - for when running tests. Usually set by either `npm run test*` commands or the test runner.
* `staging` - for staging environments.
* `production` - for production environments.

## Usage

* `npm start` - starts the service.
* `npm run dev` - start the service in development mode i.e. whenever changes are made to the source code, the application
  will automatically restart.
* `npm run test` - runs application tests.
* `npm run watch` - starts test runner in watch mode i.e. whenever changes are made to a testable unit, or it's tests have
  been changed, respective test suites will be re-run again. You could also limit the scope of what should be watched by providing
  path to given test. For example running `npm run watch tests/unit-tests/queries/FetchUserReposQuery.test.ts` will only watch and re-run tests related to `tests/unit-tests/queries/FetchUserReposQuery.test.ts` test suite.
* `npm run lint` - runs the linter.
* `npm run lint:fix` - same as `npm run lint` except for it will automatically fix linting errors whenever possible.
* `npm run validate:docs` - validates API documentation structure using OpenAPI 3.0 schema rules.

## API Docs

API documentation is written in OpenAPI 3.0 format and resides within `docs/` directory. It could be accessed via `/docs`
endpoint (enabled only for `development` and `staging` environments).