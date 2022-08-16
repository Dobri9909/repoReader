import UserDoNotExistError from '@application/errors/UserDoNotExistError';
import UserReposDoNotExistError from '@application/errors/UserReposDoNotExistError';
import { ReaderClient } from '@application/services/ReaderClient';
import ReaderClientResolver from '@application/services/ReaderClientResolver';
import { NonEmptyString } from '@domain/types';

type Input = {
  source: NonEmptyString,
  username: NonEmptyString,
}

type CommitsResponse = {
  branchName: string,
  commitSha: string,
}

type RepositoriesResponse = {
  name: string,
  ownerLogin: string,
  branches?: Array<CommitsResponse>,
}

type FiltratedRepositories = {
  name: string,
  ownerLogin: string,
}

export default class FetchUserReposQuery {
  constructor(
    private readerClientResolver: ReaderClientResolver,
  ) { }

  async fetch(input: Input): Promise<any> {
    const readerClient = this.readerClientResolver.resolve(input.source);

    const userExistingRepositories = await this.getHowMuchReposDoesUserHave(readerClient, input.username);
    const extractedUserRepos = await this.getReposPerUser(readerClient, input.username, userExistingRepositories);
    const extractUserBranchData = await this.getBranchesPerReposForUser(readerClient, input.username, extractedUserRepos);

    return {
      count: userExistingRepositories,
      items: extractUserBranchData,
    };
  }

  private async getHowMuchReposDoesUserHave(readerClient: ReaderClient, username: NonEmptyString) {
    const { data: userData } = await readerClient.extractHowManyReposDoesTheUserHave(username);

    if (userData.public_repos === 0) {
      throw new UserDoNotExistError(username);
    }

    return userData.public_repos;
  }

  private async getReposPerUser(readerClient: ReaderClient, username: NonEmptyString, numberOfRepos: number) {
    let copiedNumberOfRepos = numberOfRepos;
    const page = 1;
    const perPage = 30;
    const data: Array<FiltratedRepositories> = [];

    do {
      const { data: response } = await readerClient.extractReposPerUser(username, page, perPage);
   
      if (!response) {
        throw new UserReposDoNotExistError(username);
      }
     
      const filteredRepos = response
        .filter((repoInfo: { fork: boolean; }) => !repoInfo.fork)
        .map((filteredItems: { name: string; owner: { login: string; }; }) => ({
          name: filteredItems.name,
          ownerLogin: filteredItems.owner.login,
        }));
    
      copiedNumberOfRepos -= perPage;

      data.push(...filteredRepos);
    } while (copiedNumberOfRepos > 0);

    return data;
  }

  private async getBranchesPerReposForUser(readerClient: ReaderClient, username:string, extractedUserRepos: Array<FiltratedRepositories>) {
    const response: Array<RepositoriesResponse> = [];
    for (const repo of extractedUserRepos) {
      const branches: Array<CommitsResponse> = [];
      const { data: branchesResponse } = await readerClient.extractBranchesPerRepo(username, repo.name);

      if (!branchesResponse) {
        console.log('There is no branches for this repo');
        continue;
      }
     
      for (const repoInfo of branchesResponse) {
        branches.push({
          branchName: repoInfo.name,
          commitSha: repoInfo.commit.sha,
        });
      }

      response.push({
        ...repo,
        branches,
      });
    }

    return response;
  }

}
