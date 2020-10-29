import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export default class MailService {
    readonly transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    public verificationEmailCreator(email: string, id: string, code: string) {
        return this.transporter.sendMail({
            from: 'jiujiteironoreply@gmail.com',
            to: email,
            subject: `Activation link for jiujiteiro!`,
            text: `https://somelink.com/auth/emailVerification/${id}/${code}`,
        });
    }
}
