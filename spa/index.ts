import { ConfigService, container, Server, IApp } from 'artoo';

const configService: ConfigService = container.getService(ConfigService);

let app: IApp = {
  domain: configService.get('SPA_HOST', 'www.test.test'),
  type: 'spa',
  staticPath: 'build/spa_web'
};

export default app;