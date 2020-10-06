import { Schema, model, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface User {
    email: string;
    password: string;
}

interface UserDocument extends User, Document {}

interface UserModel extends Model<UserDocument> {
    login(email: string, password: string): User;
}

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

userSchema.pre<UserDocument>('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.statics.login = async function (email: string, password: string) {
    const user = await this.findOne({ email });
    if (!user) throw Error('Account with given email does not exist');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw Error('Password does not match');

    return user;
};

const User = model<UserDocument, UserModel>('User', userSchema);

export default User;
