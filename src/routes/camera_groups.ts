import { Express } from 'express';
import { validAuthorization } from '../services/route_middlewares';

function loadCameraGroupsRoutes(app: Express) {

    app.get('/camera-groups/', validAuthorization, async (req, res) => {
        return res.status(200).json({
            'results': [
                {
                    'id': -1,
                    'created_date': '2024-06-20T04:27:12.710849Z',
                    'modified_date': '2024-06-20T04:27:12.710866Z',
                    'active': true,
                    'name': 'Video archive default Camera Group',
                    'comment': '',
                    'deduplicate': false,
                    'deduplicateDelay': 15,
                    'labels': {},
                    'face_threshold': null,
                    'body_threshold': null,
                    'car_threshold': null
                },
                {
                    'id': 1,
                    'created_date': '2024-06-20T04:27:12.705409Z',
                    'modified_date': '2024-06-20T04:27:12.705432Z',
                    'active': true,
                    'name': 'Default Camera Group',
                    'comment': '',
                    'deduplicate': false,
                    'deduplicateDelay': 15,
                    'labels': {},
                    'face_threshold': null,
                    'body_threshold': null,
                    'car_threshold': null
                }
            ]
        });
    });

}

export { loadCameraGroupsRoutes };
