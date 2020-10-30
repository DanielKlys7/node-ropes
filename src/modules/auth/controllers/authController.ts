import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import randomatic from 'randomatic';
import { RequestHandler } from 'express';

import { cookieSettings, jwtSettings } from '../config/authConfig';
import { alreadyRegistered, wrongCredentials } from '../config/errorMessages';

import Error from '../models/Error';
import MailService from 'common/services/MailService';
import { UserModel } from '../models/User';
import { SecretModel } from '../models/Secret';

import { verificationEmailGenerator } from '../helpers/verificationEmailGenerator';

dotenv.config();

export default class AuthController {
    constructor(
        readonly user: UserModel,
        readonly secret: SecretModel,
        readonly mailService: MailService,
    ) {}

    public signupPost: RequestHandler = async (req, res) => {
        const { email, password, first_name, last_name } = req.body;
        const code = randomatic('aA0', 16);

        try {
            const user = await this.user.create({
                email,
                password,
                first_name,
                last_name,
                status: undefined,
            });
            const secret = await this.secret.create({ code, userID: user._id });

            const { subject, text } = verificationEmailGenerator(user._id, code);
            await this.mailService.send(user.email, subject, text);

            res.status(201).end();
        } catch (err) {
            const errors = this.handleErrors(err);
            res.status(400).json(errors);
        }
    };

    public loginPost: RequestHandler = async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await this.user.login(email, password);
            const token = this.createToken(user._id);

            res.cookie('jwt', token, cookieSettings);
            res.status(200).json({ userID: user._id });
        } catch (err) {
            const errors = this.handleErrors(err);
            res.status(400).json(errors);
        }
    };

    public emailConfirmRequestPost: RequestHandler = async (req, res) => {
        const { email } = req.body;
        const code = randomatic('aA0', 16);

        try {
            const user = await this.user.findOne({ email });
            const secret = await this.secret.create({ userID: user._id, code });

            const { subject, text } = verificationEmailGenerator(user._id, code);
            await this.mailService.send(user.email, subject, text);

            res.status(200).end();
        } catch (err) {
            const errors = this.handleErrors(err);
            res.status(400).json(errors);
        }
    };

    public emailConfirmPost: RequestHandler = async (req, res) => {
        const { userID, code } = req.body;

        try {
            const secret = await this.secret.findOneAndDelete({ code, userID });
            const user = await this.user.findByIdAndUpdate(secret.userID, { status: 'confirmed' });
            const token = this.createToken(user._id);

            res.cookie('jwt', token, cookieSettings);
            res.status(200).json({ userID: user._id });
        } catch (err) {
            const errors = this.handleErrors(err);
            res.status(400).json(errors);
        }
    };

    private createToken = async (id: string) => {
        jsonwebtoken.sign({ id }, process.env.JWT_SECRET, jwtSettings);
    };

    private handleErrors = async (err: Error) => {
        if (err.code === 11000) {
            return {
                errors: { email: alreadyRegistered },
            };
        }

        if (err.message === wrongCredentials) {
            return {
                errors: { email: err.message, password: err.message },
            };
        }

        if (err.message.includes('User validation failed')) {
            return Object.values(err.errors).reduce(
                (total: { errors? }, { properties: { path, message } }) => {
                    total.errors.hasOwnProperty(path)
                        ? (total.errors[path] = [total.errors[path], message])
                        : (total.errors[path] = message);

                    return total;
                },
                { errors: {} },
            );
        }

        return err;
    };
}
