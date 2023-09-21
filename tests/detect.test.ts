import { expect } from 'chai';
import { agent } from 'supertest';
import { readFile } from 'fs/promises';

import { webService } from '../src/services/web-service';

const request = agent(webService.app);

describe('Detect Route Testing', async () => {

    let token = "";

    before(async () => {
        const res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`admin:admin`).toString('base64')}`)
            .send({
                "uuid": "anything",
            })
            .type('application/json');

        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.be.null;
        token = res.body.token;
    });

    it('detect object on image', async () => {

        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/detect/`)
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

    });

    it('detect without token', async () => {

        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/detect/`)
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
            });

        expect(res.statusCode).equals(401);
        expect(res.body.code).equals("UNAUTHORIZED");
        expect(res.body.desc).equals("Authentication credentials were not provided.");

    });

    it('detect invalid token', async () => {

        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/detect/`)
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
            .set('Authorization', 'Token abc');

        expect(res.statusCode).equals(401);
        expect(res.body.code).equals("UNAUTHORIZED");
        expect(res.body.desc).equals("Invalid token.");

    });

    it('no attributes on request', async () => {
        const file = await readFile(__dirname + "/assets/11296869.jpg");

        const res = await request.post(`/detect/`)
            .attach("photo", file, {
                filename: 'photo.jpg',
                contentType: 'image/jpeg'
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });

    it('no photo on request', async () => {
        const res = await request.post(`/detect/`)
            .field('attributes', JSON.stringify({
                face: {
                    age: false,
                    beard: false,
                    emotions: false,
                    glasses: false,
                    medmask: false
                }
            }))
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.code).to.be.equal('BAD_PARAM');
    });


});
