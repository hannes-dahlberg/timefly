import { Server, ConfigService, container } from 'artoo';

const configService: ConfigService = container.getService(ConfigService);

import api from './api';
import spa from './spa';

let server = new Server({ port: parseInt(configService.get('PORT', '9090')), apps: [api, spa] });
server.start();