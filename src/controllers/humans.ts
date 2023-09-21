import { deleteFacesFromHuman } from "./faces";

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
const humans: { [humanId: number]: Human | undefined } = {};

function createHuman({ name }: { name: string }) {
    humanId++;
    const human: Human = {
        "id": humanId,
        "active": true,
        "filled": true,
        "created_date": new Date(),
        "modified_date": new Date(),
        "name": name,
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
    return human;
}

function getHuman(humanId: number) {
    const human = humans[humanId];
    return human;
}

function deleteHuman(humanId: number) {
    deleteFacesFromHuman(humanId);
    delete humans[humanId];
}

export { createHuman, getHuman, deleteHuman };
