import UserDoNotExistError from '@application/errors/UserDoNotExistError';
import UserReposDoNotExistError from '@application/errors/UserReposDoNotExistError';
import FetchUserReposQuery from '@application/queries/FetchUserReposQuery';
import ReaderClientResolver from '@application/services/ReaderClientResolver';
import { makeNonEmptyString } from '@domain/types';
import GitHubReaderClient from '@infrastructure/gitHub/GitHubReaderClient';
import MockReplicator from '@tests/util/MockReplicator';

describe('FetchUserReposQuery', () => {
  const mockReplicator = new MockReplicator();
  const mockedReaderClient = mockReplicator.replicate(GitHubReaderClient);
  const resolver =  new ReaderClientResolver([mockedReaderClient]);

  (mockedReaderClient.vendor as string) = 'github';
  const query = new FetchUserReposQuery(
    resolver,
  );

  afterEach(() => {
    mockedReaderClient.mockClear();
  });

  it('should throw UserDoNotExistError if user with that name do not exist in the vendor system that is used for extracting repos', async () => {
    mockedReaderClient.extractHowManyReposDoesTheUserHave.mockReturnValueOnce({ data: { public_repos: 0 } });

    await expect(query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    })).rejects.toThrow(UserDoNotExistError);
  });

  it('should throw UserReposDoNotExistError if user with that name do not exist in the vendor system that is used for extracting repos', async () => {
    mockedReaderClient.extractHowManyReposDoesTheUserHave.mockReturnValueOnce({ data: {
      public_repos: 1,
    } });

    mockedReaderClient.extractReposPerUser.mockReturnValueOnce([{ data: null }]);

    await expect(query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    })).rejects.toThrow(UserReposDoNotExistError);
  });

  it('should return number of repos and filtered repos', async () => {
    mockedReaderClient.extractHowManyReposDoesTheUserHave.mockReturnValueOnce({ data: {
      public_repos: 1,
    } });

    mockedReaderClient.extractReposPerUser.mockReturnValueOnce({
      data: [{
        fork: false,
        name: 'project-name-some2',
        owner: {
          login: 'Someone',
        },
      }],
    });
    
    const reposPerUser = [
      {
        name: 'master',
        commit: {
          sha: '10c106b62b32be48b950e3b7375d5fd1cc7260c7',
          url: 'https://api.github.com/repos/Someone/project-name-some2/commits/10c106b62b32be48b950e3b7375d5fd1cc7260c7'
        },
      },
    ]
    mockedReaderClient.extractBranchesPerRepo.mockReturnValueOnce({
      data: reposPerUser,
    })

    const result = await query.fetch({
      username: makeNonEmptyString('Someone'),
      source: makeNonEmptyString('github'),
    });

    expect(result.count).toEqual(1);
    expect(result.items[0]).toEqual({
      name: "project-name-some2",
      ownerLogin: "Someone",
      branches: [{
        branchName: "master",
        commitSha: "10c106b62b32be48b950e3b7375d5fd1cc7260c7"
      }]
    })
  });

});
