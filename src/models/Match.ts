import * as Joi from 'joi';
import * as mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    team1: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    team2: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
},
{
timestamps: true
});

export const Match = mongoose.model('Match', matchSchema);

export function validateMatch(match) {
    const schema = Joi.object({
        team1: Joi.string().min(5).max(50).required(),
        team2: Joi.string().min(5).max(50).required(),
        date: Joi.date()
    });
    return schema.validate(match)
}

