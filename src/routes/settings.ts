import { Express } from 'express';
import { validAuthorization } from '../services/route_middlewares.js';
import moment from 'moment';

function loadSettingsRoutes(app: Express) {

    app.get('/settings', validAuthorization, async (req, res) => {
        return res.status(200).json({
            'face_confidence_threshold': 0.714,
            'body_confidence_threshold': 0.65,
            'car_confidence_threshold': 0.65,
            'face_episodes_threshold': 0.673,
            'body_episodes_threshold': 0.75,
            'car_episodes_threshold': 0.61,
            'minimum_face_quality': 0.5,
            'minimum_car_quality': 0.65,
            'minimum_body_quality': 0.6,
            'ignore_unmatched': false,
            'license_accepted': true,
            'face_events_max_matched_age': moment.duration(1, 'day').asSeconds(),
            'face_events_max_unmatched_age': moment.duration(1, 'day').asSeconds(),
            'face_events_max_fullframe_matched_age': moment.duration(1, 'day').asSeconds(),
            'face_events_max_fullframe_unmatched_age': moment.duration(1, 'day').asSeconds(),
            'face_cluster_events_max_age': 15552000,
            'face_cluster_events_keep_best_max_age': 7776000,
            'car_events_max_matched_age': 2592000,
            'car_events_max_unmatched_age': 2592000,
            'car_events_max_fullframe_matched_age': 2592000,
            'car_events_max_fullframe_unmatched_age': 2592000,
            'car_cluster_events_max_age': 15552000,
            'car_cluster_events_keep_best_max_age': 7776000,
            'body_events_max_matched_age': 2592000,
            'body_events_max_unmatched_age': 2592000,
            'body_events_max_fullframe_matched_age': 2592000,
            'body_events_max_fullframe_unmatched_age': 2592000,
            'body_cluster_events_max_age': 15552000,
            'body_cluster_events_keep_best_max_age': 7776000,
            'face_events_features': [
                'medmask',
                'glasses',
                'gender',
                'headpose',
                'age',
                'emotions',
                'beard'
            ],
            'body_events_features': [],
            'car_events_features': [],
            'liveness_threshold': 0.674,
            'thumbnail_jpeg_quality': 50,
            'vms_cleanup_settings': {
                'keep_events_before_after': 10,
                'cleanup_threshold': 360,
                'cleanup_between_tracks': true,
                'cleanup_events_types': [
                    'face'
                ],
                'cleanup_archive': false,
                'archive_cleanup_age': null
            }
        });
    });

}

export { loadSettingsRoutes };
