import { expect } from 'chai';
import { agent } from 'supertest';

import { webService } from '../src/services/web-service.js';

const request = agent(webService.app);

describe('Sessions Route Testing', async () => {

    let token = '';

    before(async () => {
        const res = await request.post('/auth/login/')
            .set('Authorization', `Basic ${Buffer.from(`admin:admin`).toString('base64')}`)
            .send({
                'uuid': 'anything',
            })
            .type('application/json');

        expect(res.statusCode).equals(200);
        expect(res.body.token).to.not.be.undefined;
        token = res.body.token;

    });

    it('test get sessions', async () => {
        const res = await request.get(`/sessions/`).set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
    });
});
