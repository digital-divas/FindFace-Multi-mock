import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import http from 'http';

import { loadDetectRoutes } from '../routes/detect.js';
import { loadCardRoutes } from '../routes/cards.js';
import { loadAuthRoutes } from '../routes/auth.js';
import { loadSessionsRoutes } from '../routes/sessions.js';
import { loadWatchListsRoutes } from '../routes/watch-lists.js';
import { loadObjectsRoutes } from '../routes/objects.js';
import { loadEventsRoutes } from '../routes/events.js';
import { loadCameraRoutes } from '../routes/cameras.js';
import path from 'path';
import { loadUsersRoutes } from '../routes/users.js';
import { loadSettingsRoutes } from '../routes/settings.js';
import { loadGroupsRoutes } from '../routes/groups.js';
import { loadCameraGroupsRoutes } from '../routes/camera_groups.js';
import { loadFilesRoutes } from '../routes/files.js';
import MyWebSocketServer from './web-socket-server.js';


class WebService {
    private port: string;
    public readonly app: Express;
    public wss?: MyWebSocketServer;

    constructor() {
        this.port = process.env.PORT || '9093';
        this.app = express();

        this.app.use(express.static(path.join(process.cwd(), 'public')));
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
        loadUsersRoutes(this.app);
        loadSettingsRoutes(this.app);
        loadCameraGroupsRoutes(this.app);
        loadGroupsRoutes(this.app);
        loadFilesRoutes(this.app);

        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
        });

        this.app.all('*', (req: Request, res: Response) => {
            console.log('Wrong request made to:' + req.originalUrl);
            res.status(500).end();
        });
    }

    async initialize(): Promise<void> {
        console.log('[NTECHLAB MOCK] - Initializing express Web service');

        const server = http.createServer(this.app);

        this.wss = new MyWebSocketServer(server);

        return new Promise((resolve) => {

            server.listen(this.port, () => {
                console.log('[NTECHLAB MOCK] - Web service listening on port', this.port);
                resolve();
            });

        });
    }

}

export const webService = new WebService();
