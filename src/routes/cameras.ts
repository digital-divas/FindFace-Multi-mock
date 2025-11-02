import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';
import { CameraController } from '../controllers/cameras';

function loadCameraRoutes(app: Express) {

    app.post('/cameras/', validAuthorization, async (req: Request, res: Response) => {
        if (!('group' in req.body)) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'group'
            });
        }

        if (req.body.group !== 1) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': `Invalid pk "${req.body.group}" - object does not exist.`,
                'param': 'group'
            });
        }

        if (!('name' in req.body)) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'name'
            });
        }

        if (!('external_detector' in req.body) || !req.body.external_detector) {
            return res.status(400).json({
                'traceback': '',
                'code': 'emulator_param_error',
                'desc': 'the emulator is only accepting external detectors for now. so make sure to create the camera using this parameter and the value `true`.',
                'param': 'external_detector'
            });
        }

        const camera = CameraController.create({ name: req.body.name, group: req.body.group });

        return res.status(201).json(camera);

    });

    app.get('/cameras/', validAuthorization, async (req: Request, res: Response) => {

        const external_detector = req.query.external_detector;

        const cameras = CameraController.list({
            external_detector: external_detector === undefined ? undefined : external_detector === 'true'
        });

        return res.status(200).json({
            next_page: null,
            prev_page: null,
            results: cameras,
        });

    });

    app.get('/cameras/count/', validAuthorization, async (req: Request, res: Response) => {
        const external_detector = req.query.external_detector;

        const cameras = CameraController.list({
            external_detector: external_detector === undefined ? undefined : external_detector === 'true'
        });

        return res.status(200).json({
            count: cameras.length,
        });

    });

    app.delete('/cameras/:id/', validAuthorization, async (req: Request, res: Response) => {
        const cameraId = Number(req.params.id);
        const camera = CameraController.get(cameraId);

        if (!camera) {
            return res.status(404).json({
                code: 'NOT_FOUND',
                desc: 'No Camera matches the given query.',
            });
        }

        CameraController.delete(cameraId);
        return res.status(204).send();

    });

}

export { loadCameraRoutes };
