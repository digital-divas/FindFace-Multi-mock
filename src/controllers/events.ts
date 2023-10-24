import { WatchList, watchLists } from "./watch-lists";

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
    created_date: string,
    camera: number,
    camera_group: number,
    case: null,
    thumbnail: string,
    fullframe: string,
    bs_type: "overall",
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
    looks_like_confidence: null,
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
const events: { [eventId: number]: EventFace | undefined; } = {};

function createEvent({ created_date, camera }: { created_date?: string; camera: number; }) {
    eventId++;

    if (!created_date) {
        created_date = new Date().toISOString();
    }

    const date = new Date(created_date);

    const eventFace: EventFace = {
        id: String(eventId),
        episode: eventId,
        created_date: created_date,
        acknowledged_date: created_date,
        camera: camera,
        camera_group: 1,
        thumbnail: `http://localhost:5000/uploads/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/face_event/${eventId}_face_thumbnail_${randomCharacters(6)}.jpg`,
        fullframe: `http://localhost:5000/uploads/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/face_event/${eventId}_face_full_frame_${randomCharacters(6)}.jpg`,
        matched_object: "",
        matched_cluster: null,
        matched_card: null,
        temperature: null,
        case: null,
        bs_type: "overall",
        frame_coords_left: 11,
        frame_coords_top: 21,
        frame_coords_right: 62,
        frame_coords_bottom: 83,
        matched: false,
        acknowledged: true,
        acknowledged_by: 0,
        acknowledged_reaction: "",
        cluster_confidence: 0.0,
        confidence: 0.0,
        external_detector: true,
        looks_like_confidence: null,
        matched_lists: [watchLists[0].id],
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
                name: "beard",
                confidence: 0.894003
            },
            glasses: {
                name: "none",
                confidence: 0.988431
            },
            age: {
                name: 33.0,
                confidence: 1
            },
            gender: {
                name: "male",
                confidence: 0.999998
            },
            medmask: {
                name: "none",
                confidence: 0.999999
            },
            emotions: {
                name: "neutral",
                confidence: 0.97469
            }
        },
        detector_params: {
            quality: 0.79995084,
            track: {
                id: null
            }
        },
        verbose_matched_lists: [watchLists[0]],
        // TODO: once camera is implemented, bring it here
        verbose_camera: {},
        // TODO: once camera group is implemented, bring it here
        verbose_camera_group: {}
    };
    events[eventId] = eventFace;
    return eventFace;
}

export { createEvent };
