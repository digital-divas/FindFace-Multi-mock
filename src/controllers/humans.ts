import { database } from '../services/database.js';
import { deleteFacesFromHuman } from './faces.js';

interface Human {
    id: number;
    active: boolean;
    filled: boolean;
    /**
     * A String containing a date on ISO format
     */
    created_date: string;
    /**
     * A String containing a date on ISO format
     */
    modified_date: string;
    name: string;
    comment: string;
    watch_lists: number[];
    meta: { [key: string]: unknown; };
    active_after: null;
    active_before: null;
    disable_schedule: { [key: string]: unknown; };
    recount_schedule_on: null;
    face_objects: number;
    body_objects: number;
    face_cluster: number | null;
    body_cluster: number | null;
    links_to_relations: { id: number, name: string, created_date: Date, card: number, relation: number; }[];
}

export interface HumanData {
    [humanId: string]: Human;
}

let humanId = 0;

export function setHumanId(newHumanId: number) {
    humanId = newHumanId;
}

function getRandomItems<T>(list: T[], itemQty: number) {
    const copyList = [...list];

    // shuffle items
    for (let i = copyList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copyList[i], copyList[j]] = [copyList[j], copyList[i]];
    }

    return copyList.slice(0, Math.min(itemQty, list.length));
}

export class HumanController {
    static async create({ name, active, watchLists }: { name: string; active: boolean; watchLists: number[]; }) {
        humanId++;
        const human: Human = {
            id: humanId,
            active: active,
            filled: true,
            created_date: new Date().toISOString(),
            modified_date: new Date().toISOString(),
            name: name,
            comment: '',
            watch_lists: watchLists,
            meta: {},
            active_after: null,
            active_before: null,
            disable_schedule: {},
            recount_schedule_on: null,
            face_objects: 0,
            body_objects: 0,
            face_cluster: null,
            body_cluster: null,
            links_to_relations: []
        };
        const db = await database.init();
        db.data.humans[String(humanId)] = human;

        await db.write();

        return human;
    }

    static async get(id: number) {
        const db = await database.init();
        const human = db.data.humans[String(id)];
        return human;
    }

    static async list(params: {
        page: number;
        limit: number;
        threshold: number;
        active?: boolean;
        watch_lists?: string;
        ordering?: string;
        looks_like?: string;
    }) {
        const offset = params.page * params.limit;

        const db = await database.init();
        const humanList = Object.values(db.data.humans);

        const filteredHumanList = humanList.filter((human) => {
            if (!human) {
                return false;
            }

            if (params.active && !human.active) {
                return false;
            }

            if (params.watch_lists) {
                const watch_lists = params.watch_lists.split(',').map(each => Number(each));

                for (const watchList of human.watch_lists) {
                    if (watch_lists.includes(watchList)) {
                        return true;
                    }
                }

                return false;

            }
            return true;
        });

        if (!params.looks_like) {
            return filteredHumanList.slice(offset, offset + params.limit);
        }

        if (Math.random() < 0.1) {
            const maxResults = Math.floor(Math.random() * 5) + 1;
            const results = getRandomItems(filteredHumanList, Math.min(params.limit, maxResults));

            return results.map((each) => ({
                ...each,
                looks_like_confidence: (Math.random() * (1 - params.threshold)) + params.threshold
            }));
        }

        return [];
    }

    static async count() {
        const db = await database.init();
        const humanList = Object.values(db.data.humans);

        return humanList.length;
    }

    static async delete(id: number) {
        await deleteFacesFromHuman(id);
        const db = await database.init();
        delete db.data.humans[String(id)];

        await db.write();
    }
}
