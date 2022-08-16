import container from './root';
import HTTPServer from '@infrastructure/http-server/HTTPServer';

(async () => {
  const httpServer = container.resolve<HTTPServer>('httpServer');
  await httpServer.start();
})();
