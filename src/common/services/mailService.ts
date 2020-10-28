import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

export const verificationEmailCreator = (email: string, id: string, code: string) =>
    transporter.sendMail({
        from: 'jiujiteironoreply@gmail.com',
        to: email,
        subject: `Activation link for jiujiteiro!`,
        text: `https://somelink.com/auth/emailVerification/${id}/${code}`,
    });

export default {
    verificationEmailCreator,
};
