import * as Joi from 'joi';
import * as JoiObject from 'joi-oid';
import * as mongoose from 'mongoose';

const matchDetailesSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    },
    changeTime: {
        type: Number,
        min: 0,
        max: 90,
        default: 0
    }
},
{
timestamps: true
});

export const MatchDetail = mongoose.model('MatchDetail', matchDetailesSchema);

export function validateMatchDatailes(matchDetail) {
    const schema = Joi.object({
        matchId: JoiObject.objectId().required(),
        playerId: JoiObject.objectId().required(),
        positionId: JoiObject.objectId().required(),
        changeTime: Joi.number().min(0).max(90)
    });
    return schema.validate(matchDetail)
}

