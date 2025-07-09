export interface Camera {
    id: number,
    /**
     * A String containing a date on ISO format
     */
    created_date: string,
    /**
     * A String containing a date on ISO format
     */
    modified_date: string,
    group: number,
    active: boolean,
    name: string,
    comment: string,
    url: null,
    router_url: null,
    stream_settings: {
        detectors: {
            face: {
                filter_max_size: number,
                filter_min_quality: number,
                filter_min_size: number,
                fullframe_crop_rot: boolean,
                fullframe_use_png: boolean,
                jpeg_quality: number,
                overall_only: boolean,
                post_best_track_frame: boolean,
                post_best_track_normalize: boolean,
                post_first_track_frame: boolean,
                post_last_track_frame: boolean,
                realtime_post_every_interval: boolean,
                realtime_post_first_immediately: boolean,
                realtime_post_interval: number,
                roi: string,
                track_interpolate_bboxes: boolean,
                track_max_duration_frames: number,
                track_miss_interval: number,
                track_overlap_threshold: number,
                track_send_history: boolean,
                tracker_type: string,
                track_deep_sort_matching_threshold: number,
                track_deep_sort_filter_unconfirmed_tracks: boolean;
            },
            body: null,
            car: null;
        },
        disable_drops: boolean,
        ffmpeg_format: string,
        ffmpeg_params: unknown[],
        imotion_threshold: number,
        play_speed: number,
        rot: string,
        router_timeout_ms: number,
        router_verify_ssl: boolean,
        start_stream_timestamp: number,
        stream_data_filter: string,
        use_stream_timestamp: boolean,
        video_transform: string,
        enable_recorder: boolean,
        enable_liveness: boolean;
    },
    vms_cleanup_settings: {
        keep_events_before_after: null,
        cleanup_threshold: null,
        cleanup_archive: null,
        archive_cleanup_age: null,
        cleanup_between_tracks: null,
        cleanup_events_types: null;
    },
    screenshot: string,
    health_status: {
        enabled: boolean,
        status: string,
        msg: string,
        statistic: unknown,
        code: string,
        code_desc: string;
    },
    latitude: null,
    longitude: null,
    azimuth: null,
    face_count: number,
    body_count: number,
    car_count: number,
    onvif_camera: null,
    face_threshold: null,
    body_threshold: null,
    car_threshold: null,
    single_pass: boolean,
    external_detector: boolean,
    external_detector_token: string,
    external_detector_settings: unknown,
    meta: unknown,
    external_vms: null,
    external_vms_camera_id: null;
}

let cameraId = 0;
const cameras: { [cameraId: number]: Camera | undefined; } = {};

function makeToken(length: number) {
    let result = '';
    const characters = 'abcdef0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export class CameraController {
    static create({ name, group }: { name: string; group: number; }) {
        cameraId++;
        const camera: Camera = {
            id: cameraId,
            external_detector_token: makeToken(32),
            created_date: new Date().toISOString(),
            modified_date: new Date().toISOString(),
            group: group,
            screenshot: `http://localhost:5000/cameras/${cameraId}/screenshot/`,
            active: false,
            name: name,
            comment: '',
            url: null,
            router_url: null,
            stream_settings: {
                detectors: {
                    face: {
                        filter_max_size: 8192,
                        filter_min_quality: 0.5,
                        filter_min_size: 60,
                        fullframe_crop_rot: false,
                        fullframe_use_png: false,
                        jpeg_quality: 95,
                        overall_only: true,
                        post_best_track_frame: true,
                        post_best_track_normalize: true,
                        post_first_track_frame: false,
                        post_last_track_frame: false,
                        realtime_post_every_interval: false,
                        realtime_post_first_immediately: false,
                        realtime_post_interval: 1.0,
                        roi: '',
                        track_interpolate_bboxes: true,
                        track_max_duration_frames: 0,
                        track_miss_interval: 1,
                        track_overlap_threshold: 0.25,
                        track_send_history: false,
                        tracker_type: 'simple_iou',
                        track_deep_sort_matching_threshold: 0.65,
                        track_deep_sort_filter_unconfirmed_tracks: true
                    },
                    body: null,
                    car: null
                },
                disable_drops: false,
                ffmpeg_format: '',
                ffmpeg_params: [],
                imotion_threshold: 0.0,
                play_speed: -1.0,
                rot: '',
                router_timeout_ms: 15000,
                router_verify_ssl: true,
                start_stream_timestamp: 0,
                stream_data_filter: '',
                use_stream_timestamp: false,
                video_transform: '',
                enable_recorder: false,
                enable_liveness: false
            },
            vms_cleanup_settings: {
                keep_events_before_after: null,
                cleanup_threshold: null,
                cleanup_archive: null,
                archive_cleanup_age: null,
                cleanup_between_tracks: null,
                cleanup_events_types: null
            },
            health_status: {
                enabled: false,
                status: 'WAITING_FOR_SYNC',
                msg: '',
                statistic: {},
                code: 'red',
                code_desc: 'Videomanager job is missing. Wait for synchronization.'
            },
            latitude: null,
            longitude: null,
            azimuth: null,
            face_count: 0,
            body_count: 0,
            car_count: 0,
            onvif_camera: null,
            face_threshold: null,
            body_threshold: null,
            car_threshold: null,
            single_pass: false,
            external_detector: true,
            external_detector_settings: {},
            meta: {},
            external_vms: null,
            external_vms_camera_id: null
        };
        cameras[cameraId] = camera;
        return camera;
    }

    static list() {
        const cameraList = Object.values(cameras);
        return cameraList;
    }

    static get(id: number) {
        return cameras[id];
    }

    static delete(id: number) {
        delete cameras[id];
    }
}
