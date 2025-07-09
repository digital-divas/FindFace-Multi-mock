import { Express, Request, Response } from 'express';
import { validAuthorization } from '../services/route_middlewares';

const createdDate = new Date();

function makeId(length: number) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const id = makeId(128);

function loadSessionsRoutes(app: Express) {
    app.get('/sessions/', validAuthorization, async (req: Request, res: Response) => {
        return res.status(200).json({
            'next_page': null,
            'prev_page': null,
            'results': [
                {
                    'id': id,
                    'status': 'online',
                    'active': true,
                    'uuid': 'anything',
                    'mobile': false,
                    'device_info': {},
                    'ip': '127.0.0.1',
                    'last_ping_date': new Date().toISOString(),
                    'user__username': 'admin',
                    'created_date': createdDate.toISOString(),
                    'user_id': 1
                }
            ]
        });

    });

}

export { loadSessionsRoutes };
