import { expect } from 'chai';
import { agent } from 'supertest';
import { readFile } from 'fs/promises';

import { webService } from '../src/services/web-service';

const request = agent(webService.app);

describe('Cards Route Testing', async () => {

    let token = '';
    let detectionId = '';

    before(async () => {
        let res;
        res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`admin:admin`).toString('base64')}`)
            .send({
                'uuid': 'anything',
            })
            .type('application/json');

        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.be.null;
        token = res.body.token;

        const file = await readFile(__dirname + '/assets/11296869.jpg');

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
        expect(res.body.objects.face[0].id).to.not.be.null;
        detectionId = res.body.objects.face[0].id;
    });

    it('test get human by detectionId', async () => {
        const res = await request.get(`/cards/humans/`)
            .query({
                looks_like: 'detection:' + detectionId,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
    });

    it('test create, update and delete human', async () => {
        let res;
        // create
        res = await request.post(`/cards/humans/`)
            .send({ name: 'zéca', watch_lists: 1 })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.not.be.null;
        const humanId = res.body.id;

        // update
        res = await request.patch(`/cards/humans/${humanId}/`)
            .send({ name: 'zéca editado' })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.not.be.null;

        // patch without changes should be okay too
        res = await request.patch(`/cards/humans/${humanId}/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.not.be.null;

        // delete
        res = await request.delete(`/cards/humans/${humanId}/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(204);

    });

    it('test invalid human creations - no name', async () => {
        const res = await request.post(`/cards/humans/`)
            .send({ watch_lists: 1 })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid human creations - no watchlist', async () => {
        const res = await request.post(`/cards/humans/`)
            .send({ name: 'zéca' })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid human creations - invalid watchlist', async () => {
        const res = await request.post(`/cards/humans/`)
            .send({ name: 'zéca', watch_lists: -1 })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('test invalid human creations - non existent watchlist', async () => {
        const res = await request.post(`/cards/humans/`)
            .send({ name: 'zéca', watch_lists: [9999, 8888] })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(403);
        expect(res.body.code).to.be.equal('PERMISSION_DENIED');
    });

    it('test invalid human update - non existent humanId', async () => {
        const res = await request.patch(`/cards/humans/-1/`)
            .send({ name: 'zéca editado' })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.code).to.be.equal('NOT_FOUND');
    });

    it('test invalid human update - non existent humanId', async () => {
        const res = await request.delete(`/cards/humans/-1/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.code).to.be.equal('NOT_FOUND');
    });
});
