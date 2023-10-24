import { Express, Request, Response } from 'express';
import multer from 'multer';
import { validAuthorization } from '../services/route_middlewares';

const upload = multer({
    storage: multer.memoryStorage()
});

function loadDetectRoutes(app: Express) {

    app.post('/detect/', validAuthorization, upload.single('photo'), async (req: Request, res: Response) => {

        const photo = req.file;

        if (!('attributes' in req.body)) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field is required.",
                "param": "attributes"
            });
        }

        if (!photo) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field may not be null.",
                "param": "photo"
            });
        }

        // TODO: implement no face on photo
        // return res.status(200).json({
        //     "orientation": 1,
        //     "objects": {
        //     }
        // });

        return res.status(200).json({
            "orientation": 1,
            "objects": {
                "face": [
                    {
                        "id": "cj98gtt45oepj7no3h7g",
                        "bbox": {
                            "left": 0,
                            "top": 0,
                            "right": 100,
                            "bottom": 100
                        },
                        "detection_score": 0.94990854,
                        "low_quality": false,
                        "features": {}
                    }
                ]
            }
        });
    });
}

export { loadDetectRoutes };
