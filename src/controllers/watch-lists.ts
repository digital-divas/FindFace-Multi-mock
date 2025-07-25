interface WatchList {
    id: number,
    /**
     * A String containing a date on ISO format
     */
    created_date: string,
    /**
     * A String containing a date on ISO format
     */
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
    origin: 'ffsecurity';
}

let watchListId = 1;

const watchLists: WatchList[] = [
    {
        'id': -1,
        'created_date': new Date().toISOString(),
        'modified_date': new Date().toISOString(),
        'active': true,
        'name': 'Unmatched',
        'comment': 'Default list for unmatched events',
        'color': 'ffffff',
        'notify': false,
        'acknowledge': false,
        'camera_groups': [],
        'face_threshold': null,
        'body_threshold': null,
        'car_threshold': null,
        'ignore_events': false,
        'send_events_to_external_vms': false,
        'active_after': null,
        'active_before': null,
        'disable_schedule': {},
        'recount_schedule_on': null,
        'origin': 'ffsecurity'
    },
    {
        'id': 1,
        'created_date': new Date().toISOString(),
        'modified_date': new Date().toISOString(),
        'active': true,
        'name': 'Default Watch List',
        'comment': '',
        'color': '123456',
        'notify': false,
        'acknowledge': false,
        'camera_groups': [],
        'face_threshold': null,
        'body_threshold': null,
        'car_threshold': null,
        'ignore_events': false,
        'send_events_to_external_vms': false,
        'active_after': null,
        'active_before': null,
        'disable_schedule': {},
        'recount_schedule_on': null,
        'origin': 'ffsecurity'
    }
];

function getWatchLists() {
    return watchLists;
}

function createWatchList(name: string, active: boolean) {
    watchListId++;
    const watchList: WatchList = {
        'id': watchListId,
        'created_date': new Date().toISOString(),
        'modified_date': new Date().toISOString(),
        'active': active,
        'name': name,
        'comment': '',
        'color': '123456',
        'notify': false,
        'acknowledge': false,
        'camera_groups': [],
        'face_threshold': null,
        'body_threshold': null,
        'car_threshold': null,
        'ignore_events': false,
        'send_events_to_external_vms': false,
        'active_after': null,
        'active_before': null,
        'disable_schedule': {},
        'recount_schedule_on': null,
        'origin': 'ffsecurity'
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
