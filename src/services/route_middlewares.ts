import { NextFunction, Request, Response } from 'express';
import { validToken } from './token.js';

const licenseError = false;

async function validAuthorization(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            'code': 'UNAUTHORIZED',
            'desc': 'Authentication credentials were not provided.'
        });

    }

    const token = req.headers.authorization.replace('Token ', '');

    const isValidToken = await validToken(token);

    if (!isValidToken) {
        return res.status(401).json({
            'code': 'UNAUTHORIZED',
            'desc': 'Invalid token.'
        });
    }

    if (licenseError) {
        return res.status(401).json({
            'traceback': '',
            'code': 'LICENSE_ERROR',
            'desc': 'Failed to validate FFSecurity license',
            'original_error': {
                'code': 'LICENSE_ERROR',
                'desc': 'FKERROR_LICENSE: Invalid license',
                'param': null
            }
        });
    }

    next();
}

export { validAuthorization };
