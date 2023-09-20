import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';

function loadWatchListsRoutes(app: Express) {

    app.get('/watch-lists/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            "results": [
                {
                    "id": -1,
                    "created_date": "2023-09-02T15:49:23.312899Z",
                    "modified_date": "2023-09-02T15:49:23.312914Z",
                    "active": true,
                    "name": "Unmatched",
                    "comment": "Default list for unmatched events",
                    "color": "ffffff",
                    "notify": false,
                    "acknowledge": false,
                    "camera_groups": [],
                    "face_threshold": null,
                    "body_threshold": null,
                    "car_threshold": null,
                    "ignore_events": false,
                    "send_events_to_external_vms": false,
                    "active_after": null,
                    "active_before": null,
                    "disable_schedule": {},
                    "recount_schedule_on": null,
                    "origin": "ffsecurity"
                },
                {
                    "id": 1,
                    "created_date": "2023-09-02T15:49:23.306322Z",
                    "modified_date": "2023-09-02T15:49:23.306413Z",
                    "active": true,
                    "name": "Default Watch List",
                    "comment": "",
                    "color": "123456",
                    "notify": false,
                    "acknowledge": false,
                    "camera_groups": [],
                    "face_threshold": null,
                    "body_threshold": null,
                    "car_threshold": null,
                    "ignore_events": false,
                    "send_events_to_external_vms": false,
                    "active_after": null,
                    "active_before": null,
                    "disable_schedule": {},
                    "recount_schedule_on": null,
                    "origin": "ffsecurity"
                }
            ]
        });

    });

}

export { loadWatchListsRoutes };
