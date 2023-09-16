import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';

function loadCardRoutes(app: Express) {

    app.get('/cards/humans/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            "next_page": null,
            "prev_page": null,
            "results": []
        });

    });

}

export { loadCardRoutes };
