import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import User from '../models/User';
import Error from '../models/Error';
import { cookieSettings, jwtSettings } from '../config/authConfig';
import { alreadyRegistered, wrongCredentials } from '../config/errorMessages';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    }
});

const signupPost = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    try {
        const user = await User.create({ email, password, first_name, last_name });
        const token = createToken(user._id);
        res.cookie('jwt', token, cookieSettings);
        res.status(201).json({ userID: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const loginPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, cookieSettings);
        res.status(200).json({ userID: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const createToken = (id: string) => jwt.sign({ id }, process.env.JWT_SECRET, jwtSettings);

const handleErrors = (err: Error) => {
    if (err.code === 11000)
        return {
            errors: { email: alreadyRegistered },
        };

    if (err.message === wrongCredentials)
        return {
            errors: { email: err.message, password: err.message },
        };

    if (err.message.includes('User validation failed'))
        return Object.values(err.errors).reduce(
            (total: { errors? }, { properties: { path, message } }) => {
                total.errors.hasOwnProperty(path)
                    ? (total.errors[path] = [total.errors[path], message])
                    : (total.errors[path] = message);

                return total;
            },
            { errors: {} },
        );

    return err;
};

export default {
    signupPost,
    loginPost,
};
