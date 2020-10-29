import { Schema, model, Document, Model } from 'mongoose';

interface Secret {
    code: string;
    userID?: string;
    email?: string;
}

interface SecretDocument extends Secret, Document {}

export interface SecretModel extends Model<SecretDocument> {}

const secretSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
});

const Secret = model<SecretDocument, SecretModel>('Secret', secretSchema);

export default Secret;
