export type ReaderResponse = {
  headers: any,
  data: any,
}

export interface ReaderClient {
  readonly vendor: string;

  extractHowManyReposDoesTheUserHave(username: string): Promise<ReaderResponse>;
  extractReposPerUser(username: string, page: number, perPage: number): Promise<ReaderResponse>;
  extractBranchesPerRepo(owner: string, repo: string): Promise<ReaderResponse>;
}
