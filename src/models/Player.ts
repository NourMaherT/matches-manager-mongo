import * as Joi from 'joi';
import * as JoiObject from 'joi-oid';
import * as mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    position: { //default one in general
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    }
},
{
timestamps: true
});

export const Player = mongoose.model('Player', playerSchema);

export function validatePlayer(player) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        positionId: JoiObject.objectId().required()
    });
    return schema.validate(player)
}
