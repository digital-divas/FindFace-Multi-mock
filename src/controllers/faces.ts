import path from 'path';
import fs from 'fs/promises';
import { database } from '../services/database.js';

interface Face {
    id: string;
    card: number;
    /**
     * A String containing a date on ISO format
     */
    created_date: string;
    /**
     * A String containing a date on ISO format
     */
    modified_date: string;
    source_photo_name: string;
    source_photo: string;
    thumbnail: string;
    frame_coords_left: number;
    frame_coords_top: number;
    frame_coords_right: number;
    frame_coords_bottom: number;
    active: boolean;
    features: { [key: string]: unknown; };
    meta: { [key: string]: unknown; };
}

export interface FaceData {
    [faceId: string]: Face;
}

function makeId(length: number) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function randomCharacters(length: number) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function sanitizeFilename(name: string): string {
    const safe = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    return encodeURIComponent(safe);
}

async function createFace(humanId: number, photo: Express.Multer.File) {

    const faceId = makeId(19);

    const humanPath = path.join(process.cwd(), 'data', 'human', String(humanId));
    const uuid = randomCharacters(6);

    const safeName = sanitizeFilename(photo.originalname);

    await fs.mkdir(humanPath, { recursive: true });
    await fs.writeFile(path.join(humanPath, `face_${safeName}_${uuid}.jpeg`), photo.buffer);
    await fs.writeFile(path.join(humanPath, `face_${safeName}_thumbnail_${uuid}.jpeg`), photo.buffer);

    const face: Face = {
        'card': humanId,
        'created_date': new Date().toISOString(),
        'modified_date': new Date().toISOString(),
        'source_photo_name': safeName,
        'source_photo': `http://localhost:5000/uploads/cards/xP/${humanId}/face_${safeName}_${uuid}.jpeg`,
        'thumbnail': `http://localhost:5000/uploads/cards/cK/${humanId}/face_${safeName}_thumbnail_${uuid}.jpeg`,
        'frame_coords_left': 0,
        'frame_coords_top': 0,
        'frame_coords_right': 100,
        'frame_coords_bottom': 100,
        'active': true,
        'features': {},
        'id': faceId,
        'meta': {}
    };

    const db = await database.init();
    db.data.faces[faceId] = face;
    await db.write();

    return face;
}

async function getFace(faceId: string) {
    const db = await database.init();

    const face = db.data.faces[faceId];
    return face;
}

async function deleteFacesFromHuman(humanId: number) {
    const rmIds: string[] = [];

    const db = await database.init();

    for (const face of Object.values(db.data.faces)) {

        if (face.card == humanId) {
            rmIds.push(face.id);
        }
    }

    for (const rmId of rmIds) {
        await deleteFace(rmId);
    }
}

async function listFaces({ cards }: { cards?: number[]; }) {
    const db = await database.init();

    const faceObjs = Object.values(db.data.faces);

    const faceReturn: Face[] = [];

    for (const face of faceObjs) {

        if (cards && !cards.includes(face.card)) {
            continue;
        }

        faceReturn.push(face);
    }

    return faceReturn;
}

async function deleteFace(faceId: string) {
    const db = await database.init();

    const face = db.data.faces[faceId];

    const thumbnailSplitted = face.thumbnail.split('/');
    // 'source_photo': `http://localhost:5000/uploads/cards/xP/${humanId}/face_${safeName}_${uuid}.jpeg`,
    // 'thumbnail': `http://localhost:5000/uploads/cards/cK/${humanId}/face_${safeName}_thumbnail_${uuid}.jpeg`,
    const thumbnail = thumbnailSplitted.at(-1);
    let humanId = thumbnailSplitted.at(-2);
    if (thumbnail && humanId) {
        const humanPath = path.join(process.cwd(), 'data', 'human', String(humanId), thumbnail);
        try {
            await fs.unlink(humanPath);
        } catch (err) {
            console.error(`couldn't not delete file:`, humanPath);
        }
    }

    const sourcePhotoSplitted = face.source_photo.split('/');
    const sourcePhoto = sourcePhotoSplitted.at(-1);
    humanId = thumbnailSplitted.at(-2);

    if (sourcePhoto && humanId) {
        const humanPath = path.join(process.cwd(), 'data', 'human', String(humanId), sourcePhoto);
        try {
            await fs.unlink(humanPath);
        } catch (err) {
            console.error(`couldn't not delete file:`, humanPath);
        }
    }


    delete db.data.faces[faceId];
    await db.write();
}

export { createFace, getFace, deleteFacesFromHuman, deleteFace, listFaces };
