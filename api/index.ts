import { ConfigService, container, IApp } from 'artoo';
import { routes } from './routes';

const configService: ConfigService = container.getService(ConfigService);

let app: IApp = {
  domain: configService.get('API_HOST', 'api.test.test'),
  type: 'api',
  routes: routes,
  corsConfig: `http://${configService.get('SPA_HOST', '*.test.test')}:${configService.get('PORT', '1234')}`
};

export default app;