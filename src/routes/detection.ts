import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';

function loadDetectRoutes(app: Express) {

    app.post('/detect/', validAuthorization, async (req: Request, res: Response) => {

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
