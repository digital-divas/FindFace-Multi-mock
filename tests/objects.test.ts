import { expect } from 'chai';
import { agent } from 'supertest';

import { webService } from '../src/services/web-service.js';
import { readFile } from 'fs/promises';

const request = agent(webService.app);

describe('Objects Route Testing', async () => {

    let token = '';
    let humanId = 0;

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

        res = await request.post(`/cards/humans/`)
            .send({ name: 'zéca', watch_lists: 1 })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.not.be.undefined;
        humanId = res.body.id;
    });

    it('test crud face', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        let res;
        res = await request.post(`/objects/faces/`)
            .field('card', String(humanId))
            .attach('source_photo', file, {
                filename: 'photo.jpg',
                contentType: 'image/jpeg'
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(201);
        expect(res.body.id).to.not.be.undefined;
        const faceId = res.body.id;

        res = await request.delete(`/objects/faces/${faceId}/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(204);

    });

    it('bulk delete faces', async () => {
        let res;
        res = await request.post(`/cards/humans/`)
            .send({ name: 'another human', watch_lists: 1 })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.id).to.not.be.undefined;
        const anotherHuman = res.body.id;

        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        res = await request.post(`/objects/faces/`)
            .field('card', String(anotherHuman))
            .attach('source_photo', file, {
                filename: 'photo.jpg',
                contentType: 'image/jpeg'
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(201);
        expect(res.body.id).to.not.be.undefined;

        res = await request.delete(`/cards/humans/${anotherHuman}/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(204);
    });

    it('no card on request', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        const res = await request.post(`/objects/faces/`)
            .attach('source_photo', file, {
                filename: 'photo.jpg',
                contentType: 'image/jpeg'
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('invalid card on request', async () => {
        const file = await readFile(process.cwd() + '/tests/assets/11296869.jpg');

        const res = await request.post(`/objects/faces/`)
            .field('card', '-1')
            .attach('source_photo', file, {
                filename: 'photo.jpg',
                contentType: 'image/jpeg'
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('no photo on request', async () => {
        const res = await request.post(`/objects/faces/`)
            .field('card', String(humanId))
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('trying to delete non-existent face', async () => {
        const res = await request.delete(`/objects/faces/-1/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.code).to.be.equal('NOT_FOUND');
    });

    after(async () => {
        const res = await request.delete(`/cards/humans/${humanId}/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(204);
    });
});
