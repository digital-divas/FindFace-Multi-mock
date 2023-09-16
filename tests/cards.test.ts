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

    it('test get human by detectionId', async () => {
        const res = await request.get(`/cards/humans/`)
            .query({
                looks_like: "detection:" + detectionId,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
    });
});
