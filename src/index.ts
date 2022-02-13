import * as config from 'config';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';
import * as express from 'express';
// import 'express-async-errors';


import {userRouter} from './routers/users';
import {error} from './middleware/error';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/api/users', userRouter);
app.use(error);

mongoose.connect('mongodb://localhost/matches')
  .then(() => {
    console.log("Connected to the database...");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
