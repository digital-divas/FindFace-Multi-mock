import { Express } from 'express';
import { validAuthorization } from '../services/route_middlewares';
import { adminUser } from '../controllers/users';

function loadUsersRoutes(app: Express) {

    app.get('/users/me/', validAuthorization, async (req, res) => {
        return res.status(200).json(adminUser);
    });

    app.get('/users/', validAuthorization, async (req, res) => {

        return res.status(200).json({
            next_page: null,
            prev_page: null,
            results: [adminUser],
        });
    });

    app.get('/users/me/data/', validAuthorization, async (req, res) => {
        return res.status(200).json([
            {
                'user': 1,
                'key': 'LanguageModule',
                'value': '{"locale":"en"}'
            },
            {
                'user': 1,
                'key': 'smallFilters',
                'value': '{"counters":["id_in"],"episodes_humans":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"episodes_cars":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"events_faces":["acknowledged","no_match","no_face_match","no_body_match","no_car_match","dateTimeRange_undefined_undefined"],"events_bodies":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"events_cars":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"cards_humans":["has_body_objects"],"cards_cars":["has_car_objects","license_plate_number_contains"],"clusters_faces":["has_card","matched_lists"],"clusters_bodies":["has_card","matched_lists"],"clusters_cars":["has_card","matched_lists"],"cameras":["name_contains","camera_groups"],"external_detectors":["name_contains","camera_groups"],"videos":["name_contains","camera_groups"],"audit-logs":["object_type","action_type"]}'
            }
        ]);
    });

    app.get('/users/me/data/smallFilters/', validAuthorization, async (req, res) => {
        return res.status(200).json({
            'user': 1,
            'key': 'smallFilters',
            'value': '{"counters":["id_in"],"episodes_humans":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"episodes_cars":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"events_faces":["acknowledged","no_match","no_face_match","no_body_match","no_car_match","dateTimeRange_undefined_undefined"],"events_bodies":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"events_cars":["acknowledged","no_match","no_face_match","no_body_match","no_car_match"],"cards_humans":["has_body_objects"],"cards_cars":["has_car_objects","license_plate_number_contains"],"clusters_faces":["has_card","matched_lists"],"clusters_bodies":["has_card","matched_lists"],"clusters_cars":["has_card","matched_lists"],"cameras":["name_contains","camera_groups"],"external_detectors":["name_contains","camera_groups"],"videos":["name_contains","camera_groups"],"audit-logs":["object_type","action_type"]}'
        });
    });
}

export { loadUsersRoutes };
