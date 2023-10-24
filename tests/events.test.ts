import { expect } from 'chai';
import { agent } from 'supertest';
import { readFile } from 'fs/promises';

import { webService } from '../src/services/web-service';

const request = agent(webService.app);

describe('Cards Route Testing', async () => {

    let token = "";
    let detectionId = "";

    before(async () => {
        let res;
        res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`admin:admin`).toString('base64')}`)
            .send({
                "uuid": "anything",
            })
            .type('application/json');

        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.be.null;
        token = res.body.token;

        const file = await readFile(__dirname + "/assets/11296869.jpg");

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
            .attach("photo", file, {
                filename: 'photo.jpg',
                contentType: 'image/jpeg'
            })
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).equals(200);
        expect(res.body.objects.face[0].id).to.not.be.null;
        detectionId = res.body.objects.face[0].id;
    });

    it('test get events by detectionId', async () => {
        const res = await request.get(`/events/faces/`)
            .query({
                looks_like: "detection:" + detectionId,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
    });

    it('test create event with timestamp', async () => {
        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/events/faces/add/`)
            .attach("fullframe", file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', "abcdefghijklmnopqrstuvxyz1234567")
            .field('camera', "camera")
            .field('mf_selector', 'all')
            .field('timestamp', '2023-10-24T16:50:54')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.not.be.null;
    });

    it('test create event without timestamp', async () => {
        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/events/faces/add/`)
            .attach("fullframe", file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', "abcdefghijklmnopqrstuvxyz1234567")
            .field('camera', "camera")
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.not.be.null;
    });

    it('test invalid create event - missing picture', async () => {

        const res = await request.post(`/events/faces/add/`)
            .field('token', "abcdefghijklmnopqrstuvxyz1234567")
            .field('camera', "camera")
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid create event - missing token', async () => {
        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/events/faces/add/`)
            .attach("fullframe", file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('camera', "camera")
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid create event - missing camera', async () => {
        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/events/faces/add/`)
            .attach("fullframe", file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', "abcdefghijklmnopqrstuvxyz1234567")
            .field('mf_selector', 'all')
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid create event - missing mf_selector', async () => {
        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/events/faces/add/`)
            .attach("fullframe", file, {
                filename: 'fullframe.jpg',
                contentType: 'image/jpeg'
            })
            .field('token', "abcdefghijklmnopqrstuvxyz1234567")
            .field('camera', "camera")
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

});
