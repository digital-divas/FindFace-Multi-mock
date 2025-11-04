import { timeToLiveLoop } from './src/controllers/events.js';
import { database } from './src/services/database.js';
import { webService } from './src/services/web-service.js';


async function start() {
    await database.init();
    timeToLiveLoop(true);
    console.log(`database initialized...`);
    webService.initialize();
}

start();
