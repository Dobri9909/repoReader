import {
  asValue,
  asClass,
  AwilixContainer as Container,
  createContainer as createAwilixContainer,
  InjectionMode,
} from 'awilix';
import { loadConfig, Config } from '@config';
import MainRouterFactory from '@interface/routes/MainRouterFactory';
import HTTPServer from '@infrastructure/http-server/HTTPServer';
import RouterFactory from '@interface/routes/RouterFactory';
import FetchUserReposQuery from '@application/queries/FetchUserReposQuery';
import ReaderController from '@interface/controllers/ReaderController';
import ReaderClientResolver from '@application/services/ReaderClientResolver';
import ReaderRouterFactory from '@interface/routes/ReaderRouterFactory';
import GitHubReaderClient from '@infrastructure/gitHub/GitHubReaderClient';

function configureServices(container: Container, config: Config) {
  const gitHubReaderClient = container.build(asClass(GitHubReaderClient, {
    injector: () => ({
      authToken: config.gitHub.token,
    }),
  }));
  
  container.register('readerClients', asValue([
    gitHubReaderClient,
  ]));

  container.register({
    readerClientResolver: asClass(ReaderClientResolver),
  });
}

function configureQueries(container: Container) {
  container.register({
    fetchUserReposQuery: asClass(FetchUserReposQuery),
  });
}

function configureControllers(container: Container) {
  container.register({
    readerController: asClass(ReaderController),
  });
}

function configureHttpServer(container: Container, config: Config) {
  const routerFactories: Array<RouterFactory> = [
    container.build(asClass(ReaderRouterFactory)),
  ];

  container.register({
    mainRouterFactory: asClass(MainRouterFactory, {
      injector: () => ({ routerFactories }),
    }),
    httpServer: asClass(HTTPServer, {
      injector: () => ({
        config: config.server,
      }),
    }),
  });
}

const container = createAwilixContainer({
  injectionMode: InjectionMode.CLASSIC,
});

const config = loadConfig();

container.register({
  appRoot: asValue(__dirname),
  config: asValue(Object.freeze(config)),
});

configureServices(container, config);
configureQueries(container);
configureControllers(container);
configureHttpServer(container, config);

export default container;
