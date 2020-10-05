import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

import { UserModel } from '../types/User';

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Password must be at least 6 characters'],
        maxlength: [32, 'Password can only be 32 characters long'],
    },
});

userSchema.pre<UserModel>('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

const User = model('User', userSchema);

export default User;
