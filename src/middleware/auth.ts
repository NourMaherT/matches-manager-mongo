import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import {Request, Response, NextFunction} from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Not authenticated.');

    try{
        const decoded = jwt.verify(token , config.get('jwt'));
        req.userId = decoded._id;
        req.isAdmin = decoded.isAdmin;
        next();
    }
    catch(ex) {
        res.status(400).send('Invalid token.');
    }

}