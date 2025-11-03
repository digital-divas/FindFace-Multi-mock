import path from 'path';
import { WatchList, getWatchLists } from './watch-lists';
import fs from 'fs/promises';

function randomCharacters(length: number) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

interface FeatureConfidence {
    name: string | number;
    confidence: number;
}

interface EventFace {
    episode: number;
    matched_object: string,
    matched_cluster: null,
    matched_card: null,
    temperature: null,
    /**
     * A String containing a date on ISO format
     */
    created_date: string,
    camera: number,
    camera_group: number,
    case: null,
    thumbnail: string,
    fullframe: string,
    bs_type: 'overall',
    frame_coords_left: number,
    frame_coords_top: number,
    frame_coords_right: number,
    frame_coords_bottom: number,
    matched: boolean,
    confidence: number,
    cluster_confidence: number;
    quality: number,
    acknowledged_date: string,
    acknowledged_by: number,
    acknowledged_reaction: string,
    acknowledged: boolean,
    video_archive: null,
    external_detector: boolean,
    meta: object,
    id: string,
    looks_like_confidence: number | null,
    matched_lists: number[],
    detector_params: {
        quality: number,
        track: {
            id: null;
        };
    },
    features: {
        headpose_yaw: FeatureConfidence,
        headpose_pitch: FeatureConfidence,
        beard: FeatureConfidence,
        glasses: FeatureConfidence,
        age: FeatureConfidence,
        gender: FeatureConfidence,
        medmask: FeatureConfidence,
        emotions: FeatureConfidence;
    },
    verbose_matched_lists: WatchList[];
    // TODO: once camera is implemented, bring it here
    verbose_camera: object;
    // TODO: once camera group is implemented, bring it here
    verbose_camera_group: object;
}

let eventId = 0;
const events: { [eventId: string]: EventFace | undefined; } = {};

async function createEvent({ created_date, camera, photo }: { created_date?: string; camera: number; photo: Express.Multer.File; }) {
    eventId++;

    if (!created_date) {
        created_date = new Date().toISOString();
    }

    const date = new Date(created_date);
    const uuid = randomCharacters(6);

    const dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    const datePath = path.join(process.cwd(), 'data', 'face_event', ...dateString);

    await fs.mkdir(datePath, { recursive: true });
    await fs.writeFile(path.join(datePath, `${eventId}_face_thumbnail_${uuid}.jpg`), photo.buffer);
    await fs.writeFile(path.join(datePath, `${eventId}_face_full_frame_${uuid}.jpg`), photo.buffer);

    const eventFace: EventFace = {
        id: String(eventId),
        episode: eventId,
        created_date: created_date,
        acknowledged_date: created_date,
        camera: camera,
        camera_group: 1,
        thumbnail: `http://localhost:5000/uploads/${dateString}/face_event/${eventId}_face_thumbnail_${uuid}.jpg`,
        fullframe: `http://localhost:5000/uploads/${dateString}/face_event/${eventId}_face_full_frame_${uuid}.jpg`,
        matched_object: '',
        matched_cluster: null,
        matched_card: null,
        temperature: null,
        case: null,
        bs_type: 'overall',
        frame_coords_left: 11,
        frame_coords_top: 21,
        frame_coords_right: 62,
        frame_coords_bottom: 83,
        matched: false,
        acknowledged: true,
        acknowledged_by: 0,
        acknowledged_reaction: '',
        cluster_confidence: 0.0,
        confidence: (Math.random() * 0.45) + 0.5,
        external_detector: true,
        looks_like_confidence: null,
        matched_lists: [getWatchLists()[0].id],
        meta: {},
        quality: 0.79995,
        video_archive: null,
        features: {
            headpose_yaw: {
                name: 22.01571,
                confidence: 1
            },
            headpose_pitch: {
                name: -15.91327,
                confidence: 1
            },
            beard: {
                name: 'beard',
                confidence: 0.894003
            },
            glasses: {
                name: 'none',
                confidence: 0.988431
            },
            age: {
                name: 33.0,
                confidence: 1
            },
            gender: {
                name: 'male',
                confidence: 0.999998
            },
            medmask: {
                name: 'none',
                confidence: 0.999999
            },
            emotions: {
                name: 'neutral',
                confidence: 0.97469
            }
        },
        detector_params: {
            quality: 0.79995084,
            track: {
                id: null
            }
        },
        verbose_matched_lists: [getWatchLists()[0]],
        // TODO: once camera is implemented, bring it here
        verbose_camera: {},
        // TODO: once camera group is implemented, bring it here
        verbose_camera_group: {}
    };
    events[eventId] = eventFace;
    return eventFace;
}

function getEvent(eventId: number) {
    return events[eventId];
}

function resetEvents() {
    for (const eventId of Object.keys(events)) {
        delete events[eventId];
    }
}

function getEvents(params: {
    looks_like?: string;
    page: number;
    limit: number;
    ordering?: string;
    threshold?: number;
    /**
     * cameras is as string representing a list of camera id joined by a comma. Example: "1,2,3"
     */
    cameras?: string;
}) {
    const offset = params.page * params.limit;

    const eventList = Object.values(events);

    // most recent first
    eventList.sort((a, b) => {
        const aCreatedDate = a?.created_date ? new Date(a?.created_date).getTime() : new Date().getTime();
        const bCreatedDate = b?.created_date ? new Date(b?.created_date).getTime() : new Date().getTime();

        return bCreatedDate - aCreatedDate;
    });

    for (const event of eventList) {
        if (event) {
            event.looks_like_confidence = event.confidence;
        }
    }

    return eventList.filter((event) => {
        if (!event) {
            return false;
        }
        if (params.cameras) {
            const cameras = params.cameras.split(',').map(each => Number(each));
            return cameras.includes(event.camera);
        }
        return true;
    }).slice(offset, offset + params.limit);
}

export { createEvent, getEvent, resetEvents, getEvents };
