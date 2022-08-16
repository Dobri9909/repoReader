import ClientDoNotExistError from '@application/errors/ClientDoNotExistError';
import { ReaderClient } from './ReaderClient';

export default class ReaderClientResolver {
  constructor(
    private readerClients: Array<ReaderClient>,
  ) { }

  resolve(vendor: string): ReaderClient {
    const readerClient = this.readerClients.find((readerClient) => readerClient.vendor === vendor);

    if (!readerClient) {
      throw new ClientDoNotExistError(`Not supported Reading Client for vendor: ${vendor}`);
    }

    return readerClient;
  }
}
