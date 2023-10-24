import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';
import { watchLists } from '../controllers/watch-lists';

function loadWatchListsRoutes(app: Express) {

    app.get('/watch-lists/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            "results": watchLists
        });

    });

}

export { loadWatchListsRoutes };
