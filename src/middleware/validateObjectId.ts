const mongoose = require('mongoose');
import {Request, Response, NextFunction} from "express";

export function validateObjectId(req: Request, res: Response, next: NextFunction) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID');
    next();
}