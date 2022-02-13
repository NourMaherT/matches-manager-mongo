import * as express from "express";
import {Request, Response} from "express";
import {User, validateUser} from "../models/User";
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import {auth} from '../middleware/auth';
import {admin} from '../middleware/admin';
import {async} from '../middleware/async';
import {validate} from '../middleware/validate';
import {validateObjectId} from '../middleware/validateObjectId';
 

const router = express.Router();

router.get("/", async(async function(req: Request, res: Response) {
    const users = await User.find();
    res.status(200).send(users);
}));

router.get('/me', auth, async(async (req, res) => {
    const user = await User.findById(req.userId).select('-password');;
    res.send(user);
}));

router.post("/register",[auth, admin, validate(validateUser)], async(async function(req: Request, res: Response) {
    let user = await User.findOne({ username: req.body.username });
    if(user) return res.status(400).send('User is alresdy existed!');

    user = new User(_.pick(req.body, ['username', 'password', 'isAdmin']));
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const token = user.generateAuthToken();
    await user.save();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'password']));
}));

router.post("/login", validate(validateUser), async(async function(req: Request, res: Response) {
    let user = await User.findOne({ username: req.body.username });
    if(!user) return res.status(400).send('Invalid username or password.');
    
    const valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) return res.status(400).send('Invalid username or password.');

    const token = user.generateAuthToken();
    res.send(token);    

}));

router.put("/:id", [auth, admin, validateObjectId, validate(validateUser)], async(async function(req: Request, res: Response) {
    const user = await User.findByIdAndUpdate(
                                            req.params.id,
                                            {$set: { 
                                                username: req.body.username,
                                                password: req.body.password,
                                                isAdmin: req.body.isAdmin
                                            }}, 
                                            {new: true}
                                            )
    if(!user) return res.status(404).send('There is no user with the given id.');

    res.status(200).send(user);
}));

router.delete("/", [auth, admin], async(async function(req: Request, res: Response) {
    const users = await User.remove();

    res.status(200).send(users);

}));

router.delete("/:id", [auth, admin, validateObjectId], async(async function(req: Request, res: Response) {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('There is no user with the given id.');

    res.status(200).send(user);

}));


export { router as userRouter }