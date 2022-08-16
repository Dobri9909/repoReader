type Commits = {
  branchName: string,
  commitSha: string,
}

type Branch = {
  name: string,
  ownerLogin: string,
  branches: Array<Commits>,
}

type Input = {
  count: number,
  items: Array<Branch>,
}

type Response = Array<Branch>;

export default class RepositoriesResponse {
  getArray(input: Input): Response {
    return input.items.map(this.get);
  }

  private get(input: Branch) {
    return {
      name: input.name,
      ownerLogin: input.ownerLogin,
      branches: input.branches,
    };
  }
}
