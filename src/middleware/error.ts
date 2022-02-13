import {Request, Response, NextFunction} from "express";
import * as winston from 'winston';

export function error(error: Error, req: Request, res: Response, next: NextFunction) {
    winston.error('error', error.message);
    res.status(500).send('Somthing Failed...!!!');
}