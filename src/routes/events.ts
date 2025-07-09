import { Express, Request, Response } from 'express';
import multer from 'multer';
import { validAuthorization } from '../services/route_middlewares';
import { createEvent, getEvent, getEvents } from '../controllers/events';
import { CameraController } from '../controllers/cameras';

const upload = multer({
    storage: multer.memoryStorage()
});

function loadEventsRoutes(app: Express) {

    app.post('/events/faces/add/', validAuthorization, upload.single('fullframe'), async (req: Request, res: Response) => {

        if (!('token' in req.body)) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'token'
            });
        }

        if (!('camera' in req.body)) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'camera'
            });
        }

        if (!('mf_selector' in req.body)) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'mf_selector'
            });
        }

        const fullframe = req.file;

        if (!fullframe) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'No file was submitted.',
                'param': 'fullframe'
            });
        }

        const camera = CameraController.get(req.body.camera);

        if (!camera) {
            return res.status(400).json({
                traceback: '',
                code: 'BAD_PARAM',
                desc: `Invalid pk '${req.body.camera}' - object does not exist.`,
                param: 'camera'
            });
        }

        if (camera.external_detector_token !== req.body.token) {
            return res.status(403).json({
                traceback: '',
                code: 'PERMISSION_DENIED',
                desc: 'Incorrect events creation API token'
            });
        }

        // TODO: implement no face on fullframe
        // return res.status(200).json({
        //     'orientation': 1,
        //     'objects': {
        //     }
        // });

        const eventFace = createEvent({
            camera: Number(req.body.camera),
            created_date: req.body.timestamp
        });

        return res.status(200).json({
            'events': [
                eventFace.id
            ],
            'errors': []
        });
    });

    app.get('/events/faces/:id/', validAuthorization, async (req: Request, res: Response) => {
        const eventId = Number(req.params.id);
        if (Number.isNaN(eventId)) {
            return res.status(400).json({
                code: 'BAD_PARAM',
                desc: 'ID must be a positive integer.'
            });
        }
        if (eventId < 1) {
            return res.status(400).json({
                code: 'BAD_PARAM',
                desc: 'ID must be non-zero uint64 number.'
            });
        }

        const event = getEvent(eventId);
        if (!event) {
            return res.status(404).json({
                code: 'NOT_FOUND',
                desc: 'No FaceEvent matches the given query.'
            });
        }

        return res.status(200).json(event);
    });

    app.get('/events/faces/', validAuthorization, async (req: Request, res: Response) => {
        const page: number = Number(req.query.page) || 0;
        const limit: number = Number(req.query.limit) || 10;

        const events = getEvents({
            page,
            limit: limit > 1000 ? 1000 : limit,
            cameras: req.query.cameras ? String(req.query.cameras) : undefined,
        });

        return res.status(200).json({
            'next_page': null,
            'count': events.length,
            'results': events
        });
    });
}

export { loadEventsRoutes };
