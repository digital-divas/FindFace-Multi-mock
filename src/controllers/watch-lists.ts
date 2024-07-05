interface WatchList {
    id: number,
    created_date: string,
    modified_date: string,
    active: boolean,
    name: string,
    comment: string,
    color: string,
    notify: boolean,
    acknowledge: boolean,
    camera_groups: [],
    face_threshold: null,
    body_threshold: null,
    car_threshold: null,
    ignore_events: boolean,
    send_events_to_external_vms: boolean,
    active_after: null,
    active_before: null,
    disable_schedule: object,
    recount_schedule_on: null,
    origin: "ffsecurity";
}

let watchListId = 1;

const watchLists: WatchList[] = [
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
];

function getWatchLists() {
    return watchLists;
}

function createWatchList(name: string) {
    watchListId++;
    const watchList: WatchList = {
        "id": watchListId,
        "created_date": new Date().toISOString(),
        "modified_date": new Date().toISOString(),
        "active": true,
        "name": name,
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
    };
    watchLists.push(watchList);

    return watchList;
}

function getWatchList(id: number) {
    const filteredWatchLists = watchLists.filter(watchList => watchList.id == id);
    if (filteredWatchLists.length) {
        return filteredWatchLists[0];
    }
    return null;
}

export { createWatchList, getWatchLists, getWatchList, WatchList };
