import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';

interface Human {
    id: number;
    active: boolean;
    filled: boolean;
    created_date: Date;
    modified_date: Date;
    name: string;
    comment: string;
    watch_lists: number[];
    meta: { [key: string]: unknown };
    active_after: null;
    active_before: null;
    disable_schedule: { [key: string]: unknown };
    recount_schedule_on: null;
    face_objects: number;
    body_objects: number;
    face_cluster: number | null;
    body_cluster: number | null;
    links_to_relations: { id: number, name: string, created_date: Date, card: number, relation: number }[];
}

let humanId = 0;
const humans: { [humanId: number]: Human } = {};

function loadCardRoutes(app: Express) {

    app.get('/cards/humans/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            "next_page": null,
            "prev_page": null,
            "results": []
        });

    });

    app.post('/cards/humans/', validAuthorization, async (req: Request, res: Response) => {
        if (!req.body.name) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field is required.",
                "param": "name"
            });
        }

        if (!req.body.watch_lists) {
            return res.status(400).json({
                "traceback": "",
                "code": "BAD_PARAM",
                "desc": "This field is required.",
                "param": "watch_lists"
            });
        }

        let watchLists = req.body.watch_lists;

        if (!Array.isArray(watchLists)) {
            watchLists = [req.body.watch_lists];
        }


        if (watchLists != 1 || Number(watchLists[0]) != 1) {
            const missingPermissions = watchLists
                .filter((v: string | number) => !([1, -1].includes(Number(v))))
                .map((v: string | number) => `Watch list(${v}) - view`);

            if (missingPermissions.length == 0) {
                return res.status(400).json({
                    "traceback": "",
                    "code": "BAD_PARAM",
                    "desc": "You can't add watch list \"Unmatched\" to a card",
                    "param": "watch_lists"
                });
            }

            return res.status(403).json({
                "traceback": "",
                "code": "PERMISSION_DENIED",
                "desc": "Permission denied",
                "missing_permissions": missingPermissions
            });
        }

        humanId++;

        const human: Human = {
            "id": humanId,
            "active": true,
            "filled": true,
            "created_date": new Date(),
            "modified_date": new Date(),
            "name": req.body.name,
            "comment": "",
            "watch_lists": [
                1
            ],
            "meta": {},
            "active_after": null,
            "active_before": null,
            "disable_schedule": {},
            "recount_schedule_on": null,
            "face_objects": 0,
            "body_objects": 0,
            "face_cluster": null,
            "body_cluster": null,
            "links_to_relations": []
        };

        humans[humanId] = human;

        return res.status(200).json(human);

    });

    app.patch('/cards/humans/:humanId/', validAuthorization, async (req: Request, res: Response) => {

        const human = humans[Number(req.params.humanId)];

        if (!human) {
            return res.status(404).json({
                "traceback": "",
                "code": "NOT_FOUND",
                "desc": "No HumanCard matches the given query."
            });
        }

        if (req.body.name) {
            human.name = req.body.name;
        }

        return res.status(200).json(human);

    });

    app.delete('/cards/humans/:humanId/', validAuthorization, async (req: Request, res: Response) => {

        const human = humans[Number(req.params.humanId)];

        if (!human) {
            return res.status(404).json({
                "traceback": "",
                "code": "NOT_FOUND",
                "desc": "No HumanCard matches the given query."
            });
        }

        delete humans[Number(req.params.humanId)];

        return res.status(204).send();

    });

}

export { loadCardRoutes };
