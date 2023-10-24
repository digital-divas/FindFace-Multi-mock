import { Express, Request, Response } from 'express';
import multer from 'multer';
import { validAuthorization } from '../services/route_middlewares';
import { createEvent } from '../controllers/events';

const upload = multer({
    storage: multer.memoryStorage()
});

function loadEventsRoutes(app: Express) {

    app.post('/events/faces/add/', validAuthorization, upload.single('fullframe'), async (req: Request, res: Response) => {

        if (!('token' in req.body)) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field is required.",
                "param": "token"
            });
        }

        if (!('camera' in req.body)) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field is required.",
                "param": "camera"
            });
        }

        if (!('mf_selector' in req.body)) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field is required.",
                "param": "mf_selector"
            });
        }

        const fullframe = req.file;

        if (!fullframe) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "No file was submitted.",
                "param": "fullframe"
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
            "events": [
                eventFace.id
            ],
            "errors": []
        });
    });

    app.get('/events/faces/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            "next_page": null,
            "count": 0,
            "results": []
        });
    });
}

export { loadEventsRoutes };
