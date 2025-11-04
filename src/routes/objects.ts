import { Express, Request, Response } from 'express';
import multer from 'multer';
import { validAuthorization } from '../services/route_middlewares.js';
import { HumanController } from '../controllers/humans.js';
import { createFace, deleteFace, getFace, listFaces } from '../controllers/faces.js';


const upload = multer({
    storage: multer.memoryStorage()
});

function loadObjectsRoutes(app: Express) {
    app.post('/objects/faces/', validAuthorization, upload.single('source_photo'), async (req: Request, res: Response) => {
        const source_photo = req.file;

        if (!req.body.card) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'card'
            });
        }

        const human = await HumanController.get(Number(req.body.card));

        if (!human) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': `Invalid pk "${req.body.card}" - object does not exist.`,
                'param': 'card'
            });
        }

        if (!source_photo) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'source_photo must be provided',
                'param': 'source_photo'
            });
        }

        // TODO: no face on picture
        // return res.status(400).json({
        //     "traceback": "",
        //     "code": "BAD_PARAM",
        //     "desc": "All objects on a photo are of low quality or no objects found",
        //     "param": "source_photo"
        // });

        // TODO: more than one face on picture
        // return res.status(400).json({
        //     "traceback": "",
        //     "code": "BAD_PARAM",
        //     "desc": "Expected one object, found N",
        //     "param": "source_photo"
        // });

        const face = await createFace(human.id, source_photo);

        return res.status(201).json(face);

    });

    app.delete('/objects/faces/:faceId/', validAuthorization, async (req: Request, res: Response) => {
        const face = await getFace(req.params.faceId);

        if (!face) {
            return res.status(404).json({
                'traceback': '',
                'code': 'NOT_FOUND',
                'desc': 'No FaceObject matches the given query.'
            });
        }

        await deleteFace(face.id);

        return res.status(204).send();
    });

    app.get('/objects/faces/', validAuthorization, async (req: Request, res: Response) => {

        const cards = req.query.card as string | string[] | undefined;

        let cardArray: string[] = [];

        if (typeof cards === 'string') {
            cardArray = [cards];
        } else if (Array.isArray(cards)) {
            cardArray = cards;
        }

        const faces = await listFaces({
            cards: cards === undefined ? undefined : cardArray.map((card) => Number(card)),
        });

        return res.status(200).send({
            'next_page': null,
            'count': faces.length,
            'results': faces.map(face => {
                const sourcePhoto = new URL(face.source_photo);
                sourcePhoto.host = req.get('host') || 'localhost:5000';
                face.source_photo = sourcePhoto.toString();

                const thumbnail = new URL(face.thumbnail);
                thumbnail.host = req.get('host') || 'localhost:5000';
                face.thumbnail = thumbnail.toString();

                return face;
            })
        });
    });

}

export { loadObjectsRoutes };
