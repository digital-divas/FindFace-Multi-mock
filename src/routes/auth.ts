import { Express, Request, Response } from 'express';
import { generateNewToken } from '../services/token';
import { adminUser } from '../controllers/users';


function loadAuthRoutes(app: Express) {

    app.post('/auth/login/', async (req: Request, res: Response) => {

        if (!req.body.uuid) {
            return res.status(400).json({
                'traceback': '',
                'code': 'BAD_PARAM',
                'desc': 'This field is required.',
                'param': 'uuid'
            });
        }

        if (!req.headers.authorization) {
            return res.status(401).json({
                'code': 'UNAUTHORIZED',
                'desc': 'Authentication credentials were not provided.'
            });

        }

        const base64Auth = req.headers.authorization.replace('Basic ', '');
        if (atob(base64Auth) != 'admin:admin') {
            return res.status(401).json({
                'code': 'UNAUTHORIZED',
                'desc': 'Invalid username/password.'
            });
        }

        const generatedToken = generateNewToken();

        return res.status(200).json({
            'user': adminUser,
            'token': generatedToken.token,
            'token_expiration_datetime': generatedToken.token_expiration_datetime.toISOString()
        });

    });

}

export { loadAuthRoutes };
