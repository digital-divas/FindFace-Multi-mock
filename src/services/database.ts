import fs from 'fs/promises';
import path from 'path';
import { Token } from './token.js';
import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';
import { CameraData, setCameraId } from '../controllers/cameras.js';
import { EventFaceData, setEventId } from '../controllers/events.js';
import { FaceData } from '../controllers/faces.js';
import { HumanData, setHumanId } from '../controllers/humans.js';
import { createDefaultWatchLists, setWatchListId, WatchList } from '../controllers/watch-lists.js';

export type Data = {
    tokens: Token;
    cameras: CameraData;
    events: EventFaceData;
    faces: FaceData;
    humans: HumanData;
    watchLists: WatchList[];
};


class Database {
    public db?: Low<Data>;

    async init() {

        if (this.db) {
            return this.db;
        }
        const dataPath = path.join(process.cwd(), 'data');
        await fs.mkdir(dataPath, { recursive: true });


        const defaultData: Data = {
            tokens: {},
            cameras: {},
            events: {},
            faces: {},
            humans: {},
            watchLists: [],
        };

        this.db = new Low<Data>(new JSONFile<Data>(path.join(dataPath, 'db.json')), defaultData);
        await this.db.read();

        // updating last ids
        const cameraId = Math.max(...Object.values(this.db.data.cameras).map(c => c.id));
        console.log(`cameraId`, cameraId === -Infinity ? 0 : cameraId);
        setCameraId(cameraId === -Infinity ? 0 : cameraId);

        const eventId = Math.max(...Object.values(this.db.data.events).map(c => Number(c.id)));
        console.log(`eventId`, eventId === -Infinity ? 0 : eventId);
        setEventId(eventId === -Infinity ? 0 : eventId);

        const humanId = Math.max(...Object.values(this.db.data.humans).map(c => c.id));
        console.log(`humanId`, humanId === -Infinity ? 0 : humanId);
        setHumanId(humanId === -Infinity ? 0 : humanId);

        const watchListId = Math.max(...this.db.data.watchLists.map(c => c.id));
        console.log(`watchListId`, humanId === -Infinity ? 0 : watchListId);
        setWatchListId(watchListId === -Infinity ? 0 : watchListId);

        if (this.db.data.watchLists.length === 0) {
            await createDefaultWatchLists(this.db);
        }

        return this.db;
    }
}

export const database = new Database();