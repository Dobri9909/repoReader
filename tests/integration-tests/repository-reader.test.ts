import ApiClient from './utils/ApiClient';
import { expectValidationError } from './utils/expectations';

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
    const response = await apiClient.get(endpoint, { 
      source: 'github',
      username: 'rosenzzzz',
     }, {});

     expect(response.statusCode).toEqual(404);
     expect(response.body.error.code).toEqual(1008);
  });

  it('should return HTTP status 200 if user has need info', async () => {
    const response = await apiClient.get(endpoint, { 
      source: 'github',
      username: 'Rosenberg78',
     }, {});

     expect(response.statusCode).toEqual(200);
  });
  
});
