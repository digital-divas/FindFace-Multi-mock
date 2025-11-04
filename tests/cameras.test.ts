import { expect } from 'chai';
import { agent } from 'supertest';

import { webService } from '../src/services/web-service.js';
import { Camera } from '../src/controllers/cameras.js';

const request = agent(webService.app);

describe('Camera Route Testing', async () => {

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

    it('test requests without authorization token', async () => {
        let res;
        res = await request.post(`/cameras/`);
        expect(res.statusCode).to.be.equal(401);
        expect(res.body).to.be.deep.equal({
            'code': 'UNAUTHORIZED',
            'desc': 'Authentication credentials were not provided.',
        });

        res = await request.get(`/cameras/`);
        expect(res.statusCode).to.be.equal(401);
        expect(res.body).to.be.deep.equal({
            'code': 'UNAUTHORIZED',
            'desc': 'Authentication credentials were not provided.',
        });

        res = await request.delete(`/cameras/-1/`);
        expect(res.statusCode).to.be.equal(401);
        expect(res.body).to.be.deep.equal({
            'code': 'UNAUTHORIZED',
            'desc': 'Authentication credentials were not provided.',
        });
    });

    it('test create camera without/with invalid required values', async () => {
        let res;
        res = await request.post(`/cameras/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body).to.be.deep.equal({
            'traceback': '',
            'code': 'BAD_PARAM',
            'desc': 'This field is required.',
            'param': 'group',
        });

        res = await request.post(`/cameras/`)
            .send({
                group: -1,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body).to.be.deep.equal({
            'traceback': '',
            'code': 'BAD_PARAM',
            'desc': 'Invalid pk "-1" - object does not exist.',
            'param': 'group',
        });

        res = await request.post(`/cameras/`)
            .send({
                group: 1,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body).to.be.deep.equal({
            'traceback': '',
            'code': 'BAD_PARAM',
            'desc': 'This field is required.',
            'param': 'name',
        });

        res = await request.post(`/cameras/`)
            .send({
                group: 1,
                name: 'camera name'
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(400);
        expect(res.body).to.be.deep.equal({
            'traceback': '',
            'code': 'emulator_param_error',
            'desc': 'the emulator is only accepting external detectors for now. so make sure to create the camera using this parameter and the value `true`.',
            'param': 'external_detector',
        });

    });

    it('test delete non-existent camera', async () => {
        const res = await request.delete(`/cameras/-1/`)
            .set('Authorization', 'Token ' + token);

        expect(res.statusCode).to.be.equal(404);
        expect(res.body).to.be.deep.equal({
            'code': 'NOT_FOUND',
            'desc': 'No Camera matches the given query.',
        });
    });

    it('test create camera and get it', async () => {
        let res;
        res = await request.post(`/cameras/`)
            .send({
                group: 1,
                name: 'camera name',
                external_detector: true,
            })
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(201);
        expect(res.body.id).to.not.be.undefined;
        expect(res.body.external_detector_token).to.not.be.undefined;

        const cameraId = res.body.id;
        const externalDetectorToken = res.body.external_detector_token;

        res = await request.get(`/cameras/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.results).to.has.length.greaterThan(0);
        const cameras: Camera[] = res.body.results;
        const camera = cameras.find((camera) => camera.id === cameraId);
        expect(camera).to.not.be.undefined;
        expect(camera?.external_detector_token).to.be.equal(externalDetectorToken);

        res = await request.delete(`/cameras/${cameraId}/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(204);

        res = await request.get(`/cameras/`)
            .set('Authorization', 'Token ' + token);
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.results).to.has.length.greaterThanOrEqual(0);
        const camerasRemoved: Camera[] = res.body.results;
        const cameraNotFound = camerasRemoved.find((camera) => camera.id === cameraId);
        expect(cameraNotFound).to.be.undefined;
    });

});
