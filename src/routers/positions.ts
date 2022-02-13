import * as express from "express";
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import {Request, Response} from "express";
import {Position, positions, validatePosition} from "../models/Position";
import {auth} from '../middleware/auth';
import {admin} from '../middleware/admin';
import {async} from '../middleware/async';
import {validate} from '../middleware/validate';
import {validateObjectId} from '../middleware/validateObjectId';
 

const router = express.Router();

router.get("/", auth, async(async function(req: Request, res: Response) {
    const positions = await Position.find();
    res.status(200).send(positions);
}));

router.get("/:id", [validateObjectId, auth], async(async function(req: Request, res: Response) {
    const position = await Position.findById(req.params.id);
    if(!position) return res.status(404).send('There is no position with the given id.');

    res.status(200).send(position);
}));


router.post("/", [auth, admin, validate(validatePosition)], async(async function(req: Request, res: Response) {
    if (!Object.values(positions).includes(req.body.name)) return res.status(400).send(`Insert A real position!`);

    let position = await Position.findOne({ name: req.body.name })
    if(position) return res.status(400).send('Position is alresdy existed!');    

    position = new Position(_.pick(req.body, ['name']));
    
    await position.save();
    res.status(200).send(position);
}));

router.put("/:id", [validateObjectId, validate(validatePosition), auth, admin], async(async function(req: Request, res: Response) {
    const position = await Position.findByIdAndUpdate(
                                                    req.params.id,
                                                    {$set: { 
                                                        name: req.body.name
                                                    }}, 
                                                    {new: true}
                                                    );
    if(!position) return res.status(404).send('There is no position with the given id.');

    res.status(200).send(position);
}));

router.delete("/", [auth, admin], async(async function(req: Request, res: Response) {
    const positions = await Position.remove();

    res.status(200).send(positions);

}));

router.delete("/:id", [validateObjectId ,auth, admin], async(async function(req: Request, res: Response) {
    const position = await Position.findByIdAndRemove(req.params.id);
    if(!position) return res.status(404).send('There is no Position with the given id.');

    res.status(200).send(position);

}));


export { router as positionRouter }