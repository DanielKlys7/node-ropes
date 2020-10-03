import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRouter from './routes/authRoutes';

dotenv.config();
const app = express();

const mongoDBConnectionURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@jiujiteiro.euwtp.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoDBConnectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

app.use('/auth', authRouter);
