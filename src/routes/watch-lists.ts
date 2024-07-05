import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';
import { getWatchLists, createWatchList } from '../controllers/watch-lists';

function loadWatchListsRoutes(app: Express) {

    app.get('/watch-lists/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            "results": getWatchLists()
        });

    });

    app.post('/watch-lists/', validAuthorization, async (req: Request, res: Response) => {
        if (!req.body.name) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field is required.",
                "param": "name"
            });
        }

        const watchList = createWatchList(req.body.name);

        return res.status(200).json(watchList);
    });

}

export { loadWatchListsRoutes };
