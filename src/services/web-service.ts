import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import http from 'http';

import { loadDetectRoutes } from '../routes/detect';
import { loadCardRoutes } from '../routes/cards';
import { loadAuthRoutes } from '../routes/auth';
import { loadSessionsRoutes } from '../routes/sessions';
import { loadWatchListsRoutes } from '../routes/watch-lists';
import { loadObjectsRoutes } from '../routes/objects';
import { loadEventsRoutes } from '../routes/events';
import { loadCameraRoutes } from '../routes/cameras';
import path from 'path';
import { loadUsersRoutes } from '../routes/users';
import { loadSettingsRoutes } from '../routes/settings';
import { loadGroupsRoutes } from '../routes/groups';
import { loadCameraGroupsRoutes } from '../routes/camera_groups';
import { loadFilesRoutes } from '../routes/files';
import MyWebSocketServer from './web-socket-server';


class WebService {
    private port: string;
    public readonly app: Express;
    public wss?: MyWebSocketServer;

    constructor() {
        this.port = process.env.PORT || '5000';
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
