import * as config from 'config';
import * as Joi from 'joi';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 5,
        maxlength: 50,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
    });
    
userSchema.methods.generateAuthToken = function() {
    // const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, '1234')
    return token
}

export const User = mongoose.model('User', userSchema);

export function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(8).max(1024).required(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user)
}
