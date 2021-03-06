import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authMiddleware from './modules/auth/middlewares/authMiddleware';
import { authRouter } from './modules/auth/routes/authRouter';

import User from 'modules/auth/models/User';
import Secret from 'modules/auth/models/Secret';
import { mailService } from 'core/rootService';

dotenv.config();
const app = express();

const mongoDBConnectionURI = 'mongodb://mongo:27017/Jiujiteiro';

mongoose.connect(mongoDBConnectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`We are connected on port ${process.env.EXPRESS_PORT}!`);
    app.listen(process.env.EXPRESS_PORT);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser());

app.use('/auth', authRouter(User, Secret, mailService));

app.use(authMiddleware);
