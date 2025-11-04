import { database } from './src/services/database.js';
import { webService } from './src/services/web-service.js';


async function start() {
    await database.init();
    console.log(`database initialized...`);
    webService.initialize();
}

start();
