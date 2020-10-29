import { Schema, model, Document, Model } from 'mongoose';

interface Secret {
    userID: string;
    code: string;
}

interface SecretDocument extends Secret, Document {}

export interface SecretModel extends Model<SecretDocument> {}

const secretSchema = new Schema({
    userID: {
        type: String,
        required() {
            return this.email !== null;
        },
    },
    email: {
        type: String,
        required() {
            return this.userID !== null;
        },
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
});

// secretSchema.statics.createAndSend = async function (email: string, userID: string) {
//     const code = randomize('aA0', 16);
//     const secret = await this.create({ userID, code });

//     await mailService.verificationEmailCreator(email, userID, code);

//     return secret;
// };

const Secret = model<SecretDocument, SecretModel>('Secret', secretSchema);

export default Secret;
