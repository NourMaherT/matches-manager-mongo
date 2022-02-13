import * as Joi from 'joi';
import * as mongoose from 'mongoose';

export enum positions {
    offencive = "offensive",
    defencive = "defensive",
    midFielder = "midfielder",
    rightWinger = "right winger",
    leftWinger = "left winger",
    goalKeeper = "goal keeper"
}

const positionSchema = new mongoose.Schema({
    name: {
        type: String,
        // enum: positions,
        minlength: 5,
        maxlength: 50,
        unique: true,
        required: true
    }
});

export const Position = mongoose.model('Position', positionSchema);

export function validatePosition(position) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })
    return schema.validate(position)
}
