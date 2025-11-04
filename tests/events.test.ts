import { expect } from 'chai';
import { agent } from 'supertest';
import { readFile } from 'fs/promises';

import { webService } from '../src/services/web-service.js';
import { resetEvents } from '../src/controllers/events.js';

const request = agent(webService.app);

describe('Events Route Testing', async () => {

    let token = '';
    let detectionId = '';
    let cameraId = 0;
    let externalDetectorToken = '';

    before(async () => {
        let res;
        res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`admin:admin`).toString('base64')}`)
            .send({
                'uuid': 'anything',
            })
            .type('application/json');

        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.be.undefined;
        token = res.body.token;

        res = await request.post('/cameras/')
            .set('Authorization', 'Token ' + token)
            .send({
                group: 1,
                name: 'camera name',
                external_detector: true,
            })
            .type('application/json');

        expect(res.statusCode).equals(201);
        expect(res.body.id).to.not.be.undefined;
        expect(res.body.external_detector_token).to.not.be.undefined;
        cameraId = res.body.id;
        externalDetectorToken = res.body.external_detector_token;

        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        res = await request.post(`/detect/`)
            .field('attributes', JSON.stringify({
                face: {
                    age: false,
                    beard: false,
                    emotions: false,
                    glasses: false,
                    medmask: false
                }
            }))
            .attach('photo', file, {
                filename: 'photo.jpg',
                contentType: 'image/jpeg'
            })
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).equals(200);
        expect(res.body.objects.face).has.lengthOf(1);
        expect(res.body.objects.face[0].id).to.not.be.undefined;
        detectionId = res.body.objects.face[0].id;
    });

    it('test get events by detectionId', async () => {
        await resetEvents();
        const res = await request.get(`/events/faces/`)
            .query({
                looks_like: 'detection:' + detectionId,
                cameras: cameraId,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);

        expect(res.body.next_page).to.be.equal(null);
        expect(res.body.count).to.be.equal(0);
    });

    it('test create event with timestamp', async () => {
        await resetEvents();
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        let res = await request.post(`/events/faces/add/`)
            .attach('fullframe', file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', externalDetectorToken)
            .field('camera', cameraId)
            .field('mf_selector', 'all')
            .field('timestamp', '2023-10-24T16:50:54')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(200);
        expect(res.body.events).has.lengthOf(1);

        const createdEventId = res.body.events[0];

        res = await request.get(`/events/faces/`)
            .query({
                looks_like: 'detection:' + detectionId,
                cameras: cameraId,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.next_page).to.be.equal(null);
        expect(res.body.count).to.be.equal(1);
        expect(res.body.results[0].id).to.be.equal(createdEventId);

        res = await request.get(`/events/faces/`)
            .query({
                looks_like: 'detection:' + detectionId,
                cameras: '-1',
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.next_page).to.be.equal(null);
        expect(res.body.count).to.be.equal(0);
    });

    it('test create event without timestamp', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        const res = await request.post(`/events/faces/add/`)
            .attach('fullframe', file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', externalDetectorToken)
            .field('camera', cameraId)
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(200);
        expect(res.body.events).has.lengthOf(1);
    });

    it('test invalid create event - missing picture', async () => {

        const res = await request.post(`/events/faces/add/`)
            .field('token', externalDetectorToken)
            .field('camera', cameraId)
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid create event - missing token', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        const res = await request.post(`/events/faces/add/`)
            .attach('fullframe', file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('camera', cameraId)
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid create event - missing camera', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        const res = await request.post(`/events/faces/add/`)
            .attach('fullframe', file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', externalDetectorToken)
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid create event - missing mf_selector', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        const res = await request.post(`/events/faces/add/`)
            .attach('fullframe', file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', externalDetectorToken)
            .field('camera', cameraId)
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid camera or token', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');
        let res;

        res = await request.post(`/events/faces/add/`)
            .attach('fullframe', file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', externalDetectorToken)
            .field('camera', -1)
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body).to.be.deep.equal({
            traceback: '',
            code: 'BAD_PARAM',
            desc: `Invalid pk '-1' - object does not exist.`,
            param: 'camera'
        });

        res = await request.post(`/events/faces/add/`)
            .attach('fullframe', file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', 'invalid token')
            .field('camera', cameraId)
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(403);
        expect(res.body).to.be.deep.equal({
            traceback: '',
            code: 'PERMISSION_DENIED',
            desc: `Incorrect events creation API token`,
        });
    });

});
