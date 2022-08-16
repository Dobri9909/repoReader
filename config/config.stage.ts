import { Config } from './Config';
import { integerOption, stringOption } from './options';

const config: Config = {
  instance: String(process.env.HOSTNAME),
  server: {
    port: integerOption('PORT', 80),
  },
  gitHub: {
    token: stringOption('GITHUB_TOKEN'),
  },
};

export default config;
