import * as express from "express";
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import {Request, Response} from "express";
import {Match, validateMatch} from "../models/Match";
import {auth} from '../middleware/auth';
import {admin} from '../middleware/admin';
import {async} from '../middleware/async';
import {validate} from '../middleware/validate';
import {validateObjectId} from '../middleware/validateObjectId';
 

const router = express.Router();

router.get("/", auth, async(async function(req: Request, res: Response) {
    const matches = await Match
                            .find()
                            .select('-__v');
    res.status(200).send(matches);
}));

router.get("/:id", [validateObjectId, auth], async(async function(req: Request, res: Response) {
    const match = await Match.findById(req.params.id);
    if(!match) return res.status(404).send('There is no match with the given id.');

    res.status(200).send(match);
}));


router.post("/", [auth, admin, validate(validateMatch)], async(async function(req: Request, res: Response) {
    
    // Avoid Duplication
    const oldMatch = await Match.find({
        team1: req.body.team1,
        team2: req.body.team2,
        date: req.body.date
    });
    if(oldMatch) return res.status(400).send('Duplication Error.');

    const match = new Match(_.pick(req.body, ['team1', 'team2', 'date']));
    
    await match.save();
    res.status(200).send(match);
}));

router.put("/:id", [validateObjectId, validate(validateMatch), auth, admin], async(async function(req: Request, res: Response) {
    const match = await Match.findByIdAndUpdate(
                                                    req.params.id,
                                                    {$set: { 
                                                        team1: req.body.team1,
                                                        team2: req.body.team2,
                                                        date: req.body.date
                                                    }}, 
                                                    {new: true}
                                                    );
    if(!match) return res.status(404).send('There is no match with the given id.');

    res.status(200).send(match);
}));

router.delete("/", [auth, admin], async(async function(req: Request, res: Response) {
    const matches = await Match.remove();

    res.status(200).send(matches);

}));

router.delete("/:id", [validateObjectId ,auth, admin], async(async function(req: Request, res: Response) {
    const match = await Match.findByIdAndRemove(req.params.id);
    if(!match) return res.status(404).send('There is no match with the given id.');

    res.status(200).send(match);

}));


export { router as matchRouter }