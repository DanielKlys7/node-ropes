import { Schema, model, Document, Model } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

import {
    wrongCredentials,
    fieldMissing,
    fieldInvalid,
    maxLength,
    minLength,
} from '../config/errorMessages';

interface User {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    status: string;
}

interface UserDocument extends User, Document {}

export interface UserModel extends Model<UserDocument> {
    login(email: string, password: string): UserDocument;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, fieldMissing('Email')],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, fieldInvalid('Email')],
    },
    password: {
        type: String,
        required: [true, fieldMissing('Password')],
        minlength: [6, minLength('Password', 6)],
        maxlength: [32, maxLength('Password', 32)],
    },
    first_name: {
        type: String,
        required: [true, fieldMissing('First name')],
        minlength: [2, minLength('First name', 2)],
        maxLength: [32, maxLength('First name', 32)],
    },
    last_name: {
        type: String,
        required: [true, fieldMissing('Last name')],
        minlength: [2, minLength('Last name', 2)],
        maxLength: [32, maxLength('Last name', 32)],
    },
    status: {
        type: String,
        default: 'pending',
    },
});

userSchema.pre<UserDocument>('save', async function (next) {
    const salt = await bcryptjs.genSalt();
    this.password = await bcryptjs.hash(this.password, salt);

    next();
});

userSchema.statics.login = async function (email: string, password: string) {
    const user = await this.findOne({ email });
    if (!user) throw new Error(wrongCredentials);

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error(wrongCredentials);

    return user;
};

const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
