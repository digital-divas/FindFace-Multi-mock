import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares.js';
import { HumanController } from '../controllers/humans.js';
import { getWatchLists } from '../controllers/watch-lists.js';

function loadCardRoutes(app: Express) {

    app.get('/cards/humans/', validAuthorization, async (req: Request, res: Response) => {
        const page: number = Number(req.query.page) || 0;
        const limit: number = Number(req.query.limit) || 10;

        const humans = await HumanController.list({
            page,
            limit: limit > 1000 ? 1000 : limit,
            active: req.query.active ? String(req.query.active) === 'true' : undefined,
            watch_lists: req.query.watch_lists ? String(req.query.watch_lists) : undefined,
            looks_like: req.query.looks_like ? String(req.query.looks_like) : undefined,
            threshold: Number(req.query.threshold) || 0.714,
        });

        return res.status(200).json({
            'next_page': null,
            'prev_page': null,
            'results': humans
        });

    });


    app.get('/cards/humans/count/', validAuthorization, async (req: Request, res: Response) => {

        return res.status(200).json({
            'count': await HumanController.count()
        });

    });

    app.get('/human-card-attachments', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({ results: [] });
    });

    app.post('/cards/humans/', validAuthorization, async (req: Request, res: Response) => {
        if (!req.body.name) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'name'
            });
        }

        if (!req.body.watch_lists) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'watch_lists'
            });
        }

        let watchLists = req.body.watch_lists;

        if (!Array.isArray(watchLists)) {
            watchLists = [req.body.watch_lists];
        }

        if (watchLists.includes(-1)) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'You can\'t add watch list "Unmatched" to a card',
                'param': 'watch_lists'
            });
        }

        const watchListsIds = (await getWatchLists()).filter(wl => wl.id != -1).map(wl => wl.id);

        for (const watchList of watchLists) {

            if (!watchListsIds.includes(watchList)) {

                const missingPermissions = watchLists
                    .filter((v: string | number) => !(watchListsIds.includes(Number(v))))
                    .map((v: string | number) => `Watch list(${v}) - view`);

                return res.status(403).json({
                    'traceback': '',
                    'code': 'PERMISSION_DENIED',
                    'desc': 'Permission denied',
                    'missing_permissions': missingPermissions
                });
            }

        }

        const human = await HumanController.create({
            name: req.body.name,
            active: req.body.active ?? true,
            watchLists
        });

        return res.status(200).json(human);

    });

    app.patch('/cards/humans/:humanId/', validAuthorization, async (req: Request, res: Response) => {

        const human = await HumanController.get(Number(req.params.humanId));

        if (!human) {
            return res.status(404).json({
                'traceback': '',
                'code': 'NOT_FOUND',
                'desc': 'No HumanCard matches the given query.'
            });
        }

        if (req.body.name) {
            human.name = req.body.name;
        }

        if (req.body.active) {
            human.active = req.body.active;
        }

        return res.status(200).json(human);

    });

    app.delete('/cards/humans/:humanId/', validAuthorization, async (req: Request, res: Response) => {

        const humanId = Number(req.params.humanId);

        const human = await HumanController.get(humanId);

        if (!human) {
            return res.status(404).json({
                'traceback': '',
                'code': 'NOT_FOUND',
                'desc': 'No HumanCard matches the given query.'
            });
        }

        await HumanController.delete(humanId);

        return res.status(204).send();

    });

}

export { loadCardRoutes };
