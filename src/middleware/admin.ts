import {Request, Response, NextFunction} from "express";

export function admin(req: Request, res: Response, next: NextFunction) {
    if(!req.isAdmin) return res.status(403).send('Acsess Denied');
    
    next();

}
