import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares.js';
import { getWatchLists, createWatchList } from '../controllers/watch-lists.js';

function loadWatchListsRoutes(app: Express) {

    app.get('/watch-lists/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            'results': await getWatchLists()
        });

    });

    app.get('/watch-lists/count/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            'count': (await getWatchLists()).length
        });

    });

    app.post('/watch-lists/', validAuthorization, async (req: Request, res: Response) => {
        if (!req.body.name) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'name'
            });
        }

        const watchList = await createWatchList(req.body.name, req.body.active === true);

        return res.status(201).json(watchList);
    });

}

export { loadWatchListsRoutes };
