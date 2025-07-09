
interface Face {
    id: string;
    card: number;
    created_date: Date;
    modified_date: Date;
    source_photo_name: string;
    source_photo: string;
    thumbnail: string;
    frame_coords_left: number;
    frame_coords_top: number;
    frame_coords_right: number;
    frame_coords_bottom: number;
    active: boolean;
    features: { [key: string]: unknown };
    meta: { [key: string]: unknown };
}

const faces: { [faceId: string]: Face | undefined } = {};

function makeid(length: number) {
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


function createFace(humanId: number, photo: Express.Multer.File) {

    const faceId = makeid(19);

    const face: Face = {
        'card': humanId,
        'created_date': new Date(),
        'modified_date': new Date(),
        'source_photo_name': photo.originalname,
        'source_photo': `http://localhost:5000/uploads/cards/xP/${humanId}/face_${photo.originalname}_${randomCharacters(6)}.jpeg`,
        'thumbnail': `http://localhost:5000/uploads/cards/cK/${humanId}/face_${photo.originalname}_thumbnail_${randomCharacters(6)}.jpeg`,
        'frame_coords_left': 0,
        'frame_coords_top': 0,
        'frame_coords_right': 100,
        'frame_coords_bottom': 100,
        'active': true,
        'features': {},
        'id': faceId,
        'meta': {}
    };

    faces[faceId] = face;

    return face;
}

function getFace(faceId: string) {
    const face = faces[faceId];
    return face;
}

function deleteFacesFromHuman(humanId: number) {
    const rmIds: string[] = [];
    for (const faceId in faces) {
        if (!Object.prototype.hasOwnProperty.call(faces, faceId)) {
            continue;
        }

        const face = faces[faceId];

        if (!face) {
            continue;
        }

        if (face.card == humanId) {
            rmIds.push(face.id);
        }
    }

    for (const rmId of rmIds) {
        deleteFace(rmId);
    }
}

function deleteFace(faceId: string) {
    delete faces[faceId];
}

export { createFace, getFace, deleteFacesFromHuman, deleteFace };
