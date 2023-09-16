import dotenv from 'dotenv';
dotenv.config();

import { webService } from './src/services/web-service';


async function start() {
    webService.initialize();
}

start();
