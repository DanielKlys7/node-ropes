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

    public send(email: string, subject: string, text: string) {
        return this.transporter.sendMail({
            subject,
            text,
            from: {
                name: 'Daniel z Jiujiteiro.',
                address: 'jiujiteironoreply@gmail.com',
            },
            to: email,
        });
    }
}
