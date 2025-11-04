import { Express, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { getEvents } from '../controllers/events.js';

async function getCameraScreenshot(cameraId: string) {

    const events = await getEvents({ page: 0, limit: 1, cameras: cameraId });

    if (events.length === 0) {
        throw new Error('not found');
    }

    const thumbnail = events[0]?.thumbnail;

    if (!thumbnail) {
        throw new Error('not found');
    }

    const thumbNailSplitted = thumbnail.split('/');
    // /uploads/:year/:month/:day/face_event/:filename
    const fileName = thumbNailSplitted.at(-1);
    const day = thumbNailSplitted.at(-3);
    const month = thumbNailSplitted.at(-4);
    const year = thumbNailSplitted.at(-5);

    if (!fileName || !day || !month || !year) {
        throw new Error('not found');
    }

    const filePath = path.join(process.cwd(), 'data', 'face_event', year, month, day, fileName);

    return { filePath, fileName };
}


function loadFilesRoutes(app: Express) {

    app.get('/cameras/:cameraId/screenshot/', async (req: Request, res: Response) => {
        try {
            const { fileName, filePath } = await getCameraScreenshot(req.params.cameraId);

            await fs.access(filePath);
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            return res.sendFile(filePath);
        } catch (err) {
            return res.sendStatus(404);
        }
    });

    app.post('/cameras/:cameraId/screenshot/', async (req: Request, res: Response) => {
        try {
            const { fileName, filePath } = await getCameraScreenshot(req.params.cameraId);

            await fs.access(filePath);
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            return res.sendFile(filePath);
        } catch (err) {
            return res.sendStatus(404);
        }
    });

    app.get('/uploads/cards/:randomChar/:humanId/:filename', async (req: Request, res: Response) => {
        try {
            const filePath = path.join(process.cwd(), 'data', 'human', req.params.humanId, req.params.filename);

            await fs.access(filePath);
            res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);

            return res.sendFile(filePath);
        } catch (err) {
            return res.sendStatus(404);
        }
    });

    app.get('/uploads/:year/:month/:day/face_event/:filename', async (req: Request, res: Response) => {
        try {
            const filePath = path.join(process.cwd(), 'data', 'face_event', req.params.year, req.params.month, req.params.day, req.params.filename);

            await fs.access(filePath);
            res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);

            return res.sendFile(filePath);
        } catch (err) {
            return res.sendStatus(404);
        }
    });

}

export { loadFilesRoutes };
