import { NextFunction, Request, Response } from "express";
import { validToken } from "./token";


function validAuthorization(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            "code": "UNAUTHORIZED",
            "desc": "Authentication credentials were not provided."
        });

    }

    const token = req.headers.authorization.replace('Token ', '');
    if (!validToken(token)) {
        return res.status(401).json({
            "code": "UNAUTHORIZED",
            "desc": "Invalid token."
        });
    }

    next();
}

export { validAuthorization };
