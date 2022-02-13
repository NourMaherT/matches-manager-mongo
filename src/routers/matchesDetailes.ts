import * as express from "express";
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import {Request, Response} from "express";
import {MatchDetail, validateMatchDatailes} from "../models/MatchDetailes";
import {Match} from "../models/Match";
import {Player} from "../models/Player";
import {Position} from "../models/Position";
import {auth} from '../middleware/auth';
import {admin} from '../middleware/admin';
import {async} from '../middleware/async';
import {validate} from '../middleware/validate';
import {validateObjectId} from '../middleware/validateObjectId';
 

const router = express.Router();

router.get("/", auth, async(async function(req: Request, res: Response) {
    const records = await MatchDetail
                                .find()
                                .populate('match player position');
    res.status(200).send(records);
}));

router.get("/:id", [validateObjectId, auth], async(async function(req: Request, res: Response) {
    const record = await MatchDetail
                            .findById(req.params.id)
                            .populate('match player position')
                            .populate({ 
                                path: 'player',
                                populate: {
                                  path: 'position',
                                  model: 'Position'}
                                });
    if(!record) return res.status(404).send('There is no record with the given id.');

    res.status(200).send(record);
}));

// Get Players participated in a particuler match
router.get("/match/:matchId", auth, async(async function(req: Request, res: Response) {
    const match = await Match.findById(req.params.matchId);
    if(!match) return res.status(404).send('There is no match with the given id.');
    
    const records = await MatchDetail
                                .find({ match: { _id: req.params.matchId } })
                                .populate('player');
    let players = records.map(record => {
            return record.player.name;
    });
    res.status(200).send(players);

}));

// Get Matches a particuler player participated in
router.get("/player/:playerId", auth, async(async function(req: Request, res: Response) {
    const player = await Player.findById(req.params.playerId);
    if(!player) return res.status(404).send('There is no player with the given id.');
    
    const records = await MatchDetail
                                .find({ player: { _id: req.params.playerId } })
                                .populate('match');
    const matches = records.map(record => {
            return record.match;
    });
    res.status(200).send(matches);

}));

// Get one player Positions in a particuler match 
router.get("/position/:matchId/:playerId", auth, async(async function(req: Request, res: Response) {
    const match = await Match.findById(req.params.matchId);
    if(!match) return res.status(404).send('There is no match with the given id.');

    const player = await Player.findById(req.params.playerId);
    if(!player) return res.status(404).send('There is no player with the given id.');
    
    const records = await MatchDetail.find({ 
                                        match: { _id: req.params.matchId },
                                        player: { _id: req.params.playerId },
                                    })
                                    .populate('position');
    const positions = records.map(record => {
        return {
            position: record.position.name,
            changeTime: record.changeTime
        }
    });
    res.status(200).send(positions);

}));

router.post("/", [auth, admin, validate(validateMatchDatailes)], async(async function(req: Request, res: Response) {   
    const match = await Match.findById(req.body.matchId);
    if(!match) return res.status(404).send('There is no match with the given id.');

    const player = await Player.findById(req.body.playerId);
    if(!player) return res.status(404).send('There is no player with the given id.');

    const position = await Position.findById(req.body.positionId);
    if(!position) return res.status(404).send('There is no position with the given id.');

    // Avoid Duplication
    const oldRecord = await MatchDetail.find({
        match: req.body.matchId,
        player: req.body.playerId,
        position: req.body.positionId,
        changeTime: req.body.changeTime
    });
    if(oldRecord) return res.status(400).send('Duplication Error.');

    const record = new MatchDetail({
        match: req.body.matchId,
        player: req.body.playerId,
        position: req.body.positionId,
        changeTime: req.body.changeTime
    });
    
    await record.save();
    res.status(200).send(record);
}));

router.put("/:id", [validateObjectId, validate(validateMatchDatailes), auth, admin], async(async function(req: Request, res: Response) {
    const match = await Match.findById(req.body.matchId);
    if(!match) return res.status(404).send('There is no match with the given id.');

    const player = await Player.findById(req.body.playerId);
    if(!player) return res.status(404).send('There is no player with the given id.');

    const position = await Position.findById(req.body.positionId);
    if(!position) return res.status(404).send('There is no position with the given id.');

    const record = await MatchDetail.findByIdAndUpdate(
                                                    req.params.id,
                                                    {$set: { 
                                                        match: req.body.matchId,
                                                        player: req.body.playerId,
                                                        position: req.body.positionId,
                                                        changeTime: req.body.changeTime
                                                    }}, 
                                                    {new: true}
                                                    );
    if(!record) return res.status(404).send('There is no record with the given id.');

    res.status(200).send(record);
}));

router.delete("/", [auth, admin], async(async function(req: Request, res: Response) {
    const records = await MatchDetail.remove();

    res.status(200).send(records);

}));

router.delete("/:id", [validateObjectId ,auth, admin], async(async function(req: Request, res: Response) {
    const record = await MatchDetail.findByIdAndRemove(req.params.id);
    if(!record) return res.status(404).send('There is no record with the given id.');

    res.status(200).send(record);

}));


export { router as matchDetailRouter }