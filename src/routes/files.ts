import { Express, Request, Response } from 'express';

// TODO: return real images
function loadFilesRoutes(app: Express) {

    app.post('/cameras/:cameraId/screenshot/', async (req: Request, res: Response) => {
        return res.sendStatus(404);
    });

    app.get('/uploads/cards/xP/:humanId/:filename', async (req: Request, res: Response) => {
        return res.sendStatus(404);
    });

    app.get('/uploads/cards/cK/:humanId/:filename', async (req: Request, res: Response) => {
        return res.sendStatus(404);
    });

    app.get('/uploads/:year/:month/:day/face_event/:filename', async (req: Request, res: Response) => {
        return res.sendStatus(404);
    });

    app.get('/uploads/:year/:month/:day/face_event/:filename', async (req: Request, res: Response) => {
        return res.sendStatus(404);
    });

}

export { loadFilesRoutes };
