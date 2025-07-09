import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';

import { loadDetectRoutes } from '../routes/detect';
import { loadCardRoutes } from '../routes/cards';
import { loadAuthRoutes } from '../routes/auth';
import { loadSessionsRoutes } from '../routes/sessions';
import { loadWatchListsRoutes } from '../routes/watch-lists';
import { loadObjectsRoutes } from '../routes/objects';
import { loadEventsRoutes } from '../routes/events';
import { loadCameraRoutes } from '../routes/cameras';

interface WebService {
    port: string;
    app: Express;
}

class WebService {
    constructor() {
        this.port = process.env.PORT || '5000';
        this.app = express();

        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb' }));

        this.app.use(morgan('common'));
        console.log('[WebService] - Adding routes');
        loadDetectRoutes(this.app);
        loadCardRoutes(this.app);
        loadAuthRoutes(this.app);
        loadSessionsRoutes(this.app);
        loadWatchListsRoutes(this.app);
        loadObjectsRoutes(this.app);
        loadEventsRoutes(this.app);
        loadCameraRoutes(this.app);

        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).send('OK');
        });

        this.app.all('*', (req: Request, res: Response) => {
            console.log('Wrong request made to:' + req.originalUrl);
            res.status(500).end();
        });
    }

    async initialize(): Promise<void> {
        console.log('[NTECHLAB MOCK] - Initializing express Web service');

        return new Promise((resolve) => {
            this.app.listen(this.port, () => {
                console.log('[NTECHLAB MOCK] - Web service listening on port', this.port);
                resolve();
            });
        });
    }

}

export const webService = new WebService();
