import { NextFunction, Request, Response } from 'express';

import RequestValidator from '@interface/request/RequestValidator';
import extractReposRequest from '@interface/request/schemas/ExtractReposRequest';
import API from '@interface/api/API';
import APIErrors from '@interface/api/APIErrors';
import RequestValidationError from '@interface/request/RequestValidationError';
import RepositoriesResponse from '@interface/response/RepositoriesResponse';
import FetchUserReposQuery from '@application/queries/FetchUserReposQuery';
import UserDoNotExistError from '@application/errors/UserDoNotExistError';
import UserReposDoNotExistError from '@application/errors/UserReposDoNotExistError';
import ClientDoNotExistError from '@application/errors/ClientDoNotExistError';

export default class ReaderController {
  private requestValidator = new RequestValidator();
  private repositoriesResponse: RepositoriesResponse;

  constructor(
    private fetchUserReposQuery: FetchUserReposQuery,
  ) {
    this.repositoriesResponse = new RepositoriesResponse();
  }

  listRepositories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = this.requestValidator.validate(req, extractReposRequest);
      const singleBetsMap = await this.fetchUserReposQuery.fetch(validatedInput);
 
      API.sendData(res, this.repositoriesResponse.getArray(singleBetsMap));
    } catch (err) {

      if (err instanceof RequestValidationError) {
        return API.sendValidationError(res, err);
      }

      if (err instanceof ClientDoNotExistError) {
        return API.sendError(res, APIErrors.CLIENT_NOT_FOUND);
      }

      if (err instanceof UserDoNotExistError || UserReposDoNotExistError) {
        return API.sendError(res, APIErrors.USER_REPOS_NOT_FOUND);
      }

      next(err);
    }
  };
}
