import ApiClient from './utils/ApiClient';
import { expectValidationError } from './utils/expectations';
import nock from 'nock';

describe('List repositories', () => {
  const apiClient = new ApiClient();
  const endpoint = '/v1/listRepositories';

  it('should return HTTP status 400[3001] if source is invalid', async () => {
    const response = await apiClient.get(endpoint, {
      source: null,
      username: 'asd',
    }, {});

    expectValidationError(response, [{
      code: 3001,
      field: 'source',
    }]);
  });

  it('should return HTTP status 400[3002] if username is invalid', async () => {
    const response = await apiClient.get(endpoint, {
      source: 'github',
      username: null,
    }, {});

    expectValidationError(response, [{
      code: 3002,
      field: 'username',
    }]);
  });

  it('should return HTTP status 404[1009] if cannot determine reading client based on provided source', async () => {
    const response = await apiClient.get(endpoint, {
      source: 'gitlab',
      username: 'some-user',
    }, {});

    expect(response.statusCode).toEqual(404);
    expect(response.body.error.code).toEqual(1009);
  });

  it('should return HTTP status 404[1008] if user do not have any repositories', async () => {
    const username = 'some-not-existing-username-1234';
    nock('https://api.github.com')
      .get(`/users/${username}?username=${username}`)
      .reply(500);

    const response = await apiClient.get(endpoint, {
      source: 'github',
      username,
    }, {});

    expect(response.statusCode).toEqual(404);
    expect(response.body.error.code).toEqual(1008);
  });

  it('should return HTTP status 200 if user has need info', async () => {
    const username = 'it-should-work-with-this-user';
    nock('https://api.github.com')
      .persist()
      .get(`/users/${username}?username=${username}`)
      .reply(200, { public_repos: 1 })
      .get(`/users/${username}/repos?username=${username}&per_page=30&page=1`)
      .reply(200, [{
        fork: false,
        name: 'project-name-some2',
        owner: {
          login: username,
        },
      }])
      .get(`/repos/${username}/project-name-some2/branches?owner=${username}&repo=project-name-some2`)
      .reply(200, [{
        name: 'master',
        commit: {
          sha: '10c106b62b32be48b950e3b7375d5fd1cc7260c7',
        },
      }]);

    const response = await apiClient.get(endpoint, {
      source: 'github',
      username,
    }, {});

    expect(response.statusCode).toEqual(200);
  });
  
});
