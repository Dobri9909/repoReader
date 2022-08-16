import request, { Response as SuperTestResponse } from 'supertest';
import { PlainObject } from '@domain/types';
import HTTPServer from '@infrastructure/http-server/HTTPServer';
import { Application } from 'express';
import container from '../../../root';

export type Response = SuperTestResponse;

export default class ApiClient {
  private app: Application;

  constructor() {
    const httpServer = container.resolve<HTTPServer>('httpServer');
    this.app = httpServer.getExpressApp();
  }

  async get(endpoint: string, params: PlainObject = {}, headers: PlainObject = {}): Promise<Response> {
    return request(this.app)
      .get(endpoint)
      .query(params)
      .set(headers);
  }
}
