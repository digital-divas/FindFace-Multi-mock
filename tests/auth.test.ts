import { expect } from 'chai';
import { agent } from 'supertest';

import { webService } from '../src/services/web-service';

const request = agent(webService.app);

describe('Auth Route Testing', async () => {

    it('test login route', async () => {
        const res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`admin:admin`).toString('base64')}`)
            .send({
                'uuid': 'anything',
            })
            .type('application/json');

        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.be.null;
    });

    it('test login route without uuid body', async () => {
        const res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`admin:admin`).toString('base64')}`)
            .type('application/json');

        expect(res.statusCode).equals(400);
        expect(res.body.code).equals('BAD_PARAM');
        expect(res.body.desc).equals('This field is required.');
    });

    it('test login route without authorization', async () => {
        const res = await request.post('/auth/login/')
            .send({
                'uuid': 'anything',
            })
            .type('application/json');

        expect(res.statusCode).equals(401);
        expect(res.body.code).equals('UNAUTHORIZED');
        expect(res.body.desc).equals('Authentication credentials were not provided.');
    });

    it('test login route wrong user:pass', async () => {
        const res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`aaaaaa:babababa`).toString('base64')}`)
            .send({
                'uuid': 'anything',
            })
            .type('application/json');

        expect(res.statusCode).equals(401);
        expect(res.body.code).equals('UNAUTHORIZED');
        expect(res.body.desc).equals('Invalid username/password.');
    });

});
