import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import randomatic from 'randomatic';

import MailService from 'common/services/MailService';
import { UserModel } from '../models/User';
import { SecretModel } from '../models/Secret';
import Error from '../models/Error';
import { cookieSettings, jwtSettings } from '../config/authConfig';
import { alreadyRegistered, wrongCredentials } from '../config/errorMessages';
import { verificationEmailGenerator } from '../helpers/verificationEmailGenerator';

type AuthRouter = (user: UserModel, secret: SecretModel, mailService: MailService) => Router;

export const authRouter: AuthRouter = (user, secret, mailService) => {
    const baseRouter = Router();

    baseRouter.post(
        '/signup',
        async ({ body: { email, password, first_name, last_name } }, res) => {
            const code = randomatic('aA0', 16);

            try {
                const createdUser = await user.create({
                    email,
                    password,
                    first_name,
                    last_name,
                    status: undefined,
                });

                await secret.create({ code, userID: createdUser._id });

                const { subject, text } = verificationEmailGenerator(createdUser._id, code);

                await mailService.send(createdUser.email, subject, text);

                res.status(201).end();
            } catch (err) {
                const errors = handleErrors(err);
                res.status(400).send(errors);
            }
        },
    );

    baseRouter.post('/login', async ({ body: { email, password } }, res) => {
        try {
            const logedUser = await user.login(email, password);
            const token = createToken(logedUser._id);

            res.cookie('jwt', token, cookieSettings);
            res.status(200).json({ userID: logedUser._id });
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json(errors);
        }
    });

    baseRouter.post('/emailConfirm', async ({ body: { email } }, res) => {
        const code = randomatic('aA0', 16);

        try {
            const foundUser = await user.findOne({ email });
            secret.create({ code, userID: foundUser._id });

            const { subject, text } = verificationEmailGenerator(foundUser._id, code);
            await mailService.send(email, subject, text);

            res.status(200).end();
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json(errors);
        }
    });

    baseRouter.post('/emailConfirmRequest', async ({ body: { userID, code } }, res) => {
        try {
            const foundSecret = await secret.findOneAndDelete({ code, userID });
            const foundUser = await user.findByIdAndUpdate(foundSecret.userID, {
                status: 'confirmed',
            });
            const token = createToken(foundUser._id);

            res.cookie('jwt', token, cookieSettings);
            res.status(200).json({ userID: foundUser._id });
        } catch (err) {
            const errors = handleErrors(err);
            res.status(400).json(errors);
        }
    });

    return baseRouter;
};

const createToken = async (id: string) => {
    jsonwebtoken.sign({ id }, process.env.JWT_SECRET, jwtSettings);
};

const handleErrors = (err: Error) => {
    if (err.code === 11000) return { email: alreadyRegistered };

    if (err.message === wrongCredentials) return { email: err.message, password: err.message };

    if (err.message.includes('User validation failed')) {
        return Object.keys(err.errors).reduce((total, current) => {
            total[current] = err.errors[current].properties.message;

            return total;
        }, {});
    }

    return err;
};
