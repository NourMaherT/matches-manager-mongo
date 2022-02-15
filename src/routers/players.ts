import * as express from "express";
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import {Request, Response} from "express";
import {Player, validatePlayer} from "../models/Player";
import {Position} from "../models/Position";
import {auth} from '../middleware/auth';
import {admin} from '../middleware/admin';
import {async} from '../middleware/async';
import {validate} from '../middleware/validate';
import {validateObjectId} from '../middleware/validateObjectId';
 

const router = express.Router();

router.get("/", auth, async(async function(req: Request, res: Response) {
    const players = await Player
                                .find()
                                .populate('position');
    res.status(200).send(players);
}));

router.get("/:id", [validateObjectId, auth], async(async function(req: Request, res: Response) {
    const player = await Player
                            .findById(req.params.id)
                            .populate('position');
    if(!player) return res.status(404).send('There is no player with the given id.');

    res.status(200).send(player);
}));


router.post("/", [auth, admin, validate(validatePlayer)], async(async function(req: Request, res: Response) {   
    const position = await Position.findById(req.body.positionId);
    if(!position) return res.status(404).send('There is no position with the given id.')

    // Avoid Duplication
    const oldPlayer = await Player.findOne({
        name: req.body.name,
        position: req.body.positionId
    });
    if(oldPlayer) return res.status(400).send('Duplication Error.');

    const player = new Player({
        name: req.body.name,
        position: req.body.positionId
    });
    
    await player.save();
    res.status(200).send(player);
}));

router.put("/:id", [validateObjectId, validate(validatePlayer), auth, admin], async(async function(req: Request, res: Response) {
    const position = await Position.findById(req.body.positionId);
    if(!position) return res.status(404).send('There is no position with the given id.')

    const player = await Player.findByIdAndUpdate(
                                                    req.params.id,
                                                    {$set: { 
                                                        name: req.body.name,
                                                        position: req.body.positionId
                                                    }}, 
                                                    {new: true}
                                                    );
    if(!player) return res.status(404).send('There is no player with the given id.');

    res.status(200).send(player);
}));

router.delete("/", [auth, admin], async(async function(req: Request, res: Response) {
    const players = await Player.remove();

    res.status(200).send(players);

}));

router.delete("/:id", [validateObjectId ,auth, admin], async(async function(req: Request, res: Response) {
    const player = await Player.findByIdAndRemove(req.params.id);
    if(!player) return res.status(404).send('There is no player with the given id.');

    res.status(200).send(player);

}));


export { router as playerRouter }