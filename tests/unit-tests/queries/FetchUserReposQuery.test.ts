import UserDoNotExistError from '@application/errors/UserDoNotExistError';
import UserReposDoNotExistError from '@application/errors/UserReposDoNotExistError';
import FetchUserReposQuery from '@application/queries/FetchUserReposQuery';
import { makeNonEmptyString } from '@domain/types';
import container from '../../../root';

describe('FetchUserReposQuery', () => {
  const githubReader = container.resolve('readerClients')[0];
  const resolver = container.resolve('readerClientResolver');
  
  const query = new FetchUserReposQuery(
    resolver,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UserDoNotExistError if user with that name do not exist in the vendor system that is used for extracting repos', async () => {
    jest.spyOn(githubReader, 'extractHowManyReposDoesTheUserHave').mockReturnValueOnce({ data: { public_repos: 0 } });

    await expect(query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    })).rejects.toThrow(UserDoNotExistError);
  });

  it('should throw UserReposDoNotExistError if user with that name do not exist in the vendor system that is used for extracting repos', async () => {
    jest.spyOn(githubReader, 'extractHowManyReposDoesTheUserHave').mockReturnValueOnce({ data: { public_repos: 1 } });
    jest.spyOn(githubReader, 'extractReposPerUser').mockReturnValueOnce({ data: null });
    await expect(query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    })).rejects.toThrow(UserReposDoNotExistError);
  });

  it('should return number of repos for specified user', async () => {
    jest.spyOn(githubReader, 'extractHowManyReposDoesTheUserHave').mockReturnValueOnce({ data: { public_repos: 1 } });
   
    const result = await query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    });

    expect(result.count).toEqual(1);
  });

  it('should return empty array if user repos are all forks', async () => {
    jest.spyOn(githubReader, 'extractHowManyReposDoesTheUserHave').mockReturnValueOnce({ data: { public_repos: 1 } });
    jest.spyOn(githubReader, 'extractReposPerUser').mockReturnValueOnce({ data: [{
      fork: true,
      name: 'project-name-some2',
      owner: {
        login: 'Someone',
      },
    }] });

    const result = await query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    });

    expect(result.count).toEqual(1);
    expect(result.items).toBeArrayOfSize(0);
  });

  it('should return number of repos and filtered (non forked ones) repos', async () => {
    jest.spyOn(githubReader, 'extractHowManyReposDoesTheUserHave').mockReturnValueOnce({ data: { public_repos: 1 } });
    jest.spyOn(githubReader, 'extractReposPerUser').mockReturnValueOnce({ data: [{
      fork: false,
      name: 'project-name-some2',
      owner: {
        login: 'Someone',
      },
    }] });
    
    const reposPerUser = [
      {
        name: 'master',
        commit: {
          sha: '10c106b62b32be48b950e3b7375d5fd1cc7260c7',
          url: 'https://api.github.com/repos/Someone/project-name-some2/commits/10c106b62b32be48b950e3b7375d5fd1cc7260c7',
        },
      },
    ];

    jest.spyOn(githubReader, 'extractBranchesPerRepo').mockReturnValueOnce({ data: reposPerUser });

    const result = await query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    });

    expect(result.count).toEqual(1);
    expect(result.items[0]).toEqual({
      name: 'project-name-some2',
      ownerLogin: 'Someone',
      branches: [{
        branchName: 'master',
        commitSha: '10c106b62b32be48b950e3b7375d5fd1cc7260c7',
      }],
    });
  });
});
