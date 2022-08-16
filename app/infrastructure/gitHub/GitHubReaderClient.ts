import { ReaderResponse } from '@application/services/ReaderClient';
import { Octokit } from '@octokit/core';

export default class GitHubReaderClient {
  public readonly vendor = 'github';
  private octokit: Octokit;
    
  constructor(
    authToken: string,
  ) {
    this.octokit = new Octokit({
      auth: authToken,
    });
  }

  async extractHowManyReposDoesTheUserHave(username: string): Promise<ReaderResponse> {
    try {
      return this.octokit.request(`/users/${username}`, {
        username,
      });
    } catch (error) {
      this.octokit.log.error('Something went wrong', error);
      throw new Error('Error occurred');
    }
  }

  async extractReposPerUser(username: string, page: number, perPage: number): Promise<ReaderResponse> {
    try {
      return this.octokit.request(`/users/${username}/repos`, {
        username,
        per_page: perPage,
        page,
      });
    } catch (error) {
      this.octokit.log.error('Something went wrong', error);
      throw new Error('Error occurred');
    }
  }

  async extractBranchesPerRepo(owner: string, repo: string): Promise<ReaderResponse> {
    try {
      return this.octokit.request(`/repos/${owner}/${repo}/branches`, {
        owner,
        repo,
      });
    } catch (error) {
      this.octokit.log.error('Something went wrong', error);
      throw new Error('Error occurred');
    }
  }
}
