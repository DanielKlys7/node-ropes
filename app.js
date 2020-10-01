require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const User = require('./models/User');

const mongoDBConnectionURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@jiujiteiro.euwtp.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;

mongoose
    .connect(mongoDBConnectionURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected!');
        app.listen(3000);
    })
    .catch(err => console.error(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
    const { username, password, isAdmin } = req.body;

    const user = new User({
        username,
        password,
        isAdmin,
    });

    user.save()
        .then(result => res.send(result))
        .catch(err => console.error(err));
});

app.get('/', (req, res) => {
    User.find().then(result => res.json(result));
});
