import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';
import { createEvent, getEvent, getEvents } from '../controllers/events';

function loadCameraRoutes(app: Express) {

    app.post('/cameras/', validAuthorization, async (req: Request, res: Response) => {



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

        // TODO: implement token validation
        // return res.status(403).json({
        //     "traceback": "",
        //     "code": "PERMISSION_DENIED",
        //     "desc": "Incorrect events creation API token"
        // });

        // TODO: implement camera_id validation
        // return res.status(400).json({
        //     "traceback": "",
        //     "code": "BAD_PARAM",
        //     "desc": `Invalid pk "${req.body.camera}" - object does not exist.`,
        //     "param": "camera"
        // });

        // TODO: implement no face on fullframe
        // return res.status(200).json({
        //     "orientation": 1,
        //     "objects": {
        //     }
        // });

        const eventFace = createEvent({
            camera: req.body.camera,
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
        const events = getEvents();

        return res.status(200).json({
            'next_page': null,
            'count': events.length,
            'results': events
        });
    });
}

export { loadCameraRoutes };
