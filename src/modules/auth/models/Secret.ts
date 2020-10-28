import { Schema, model, Document, Model } from 'mongoose';
import randomize from 'randomatic';

import { transporter, verificationEmailCreator } from 'common/services/mailService';

interface Secret {
    userID: string;
    code: string;
}

interface SecretDocument extends Secret, Document {}

interface SecretModel extends Model<SecretDocument> {
    createAndSend(userID: string, email: string): SecretDocument;
}

const secretSchema = new Schema({
    userID: {
        type: String,
        required: true,
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

secretSchema.statics.createAndSend = async function (email: string, userID: string) {
    const code = randomize('aA0', 16);
    const secret = await this.create({ userID, code });

    await verificationEmailCreator(email, userID, code);

    return secret;
};

const Secret = model<SecretDocument, SecretModel>('Secret', secretSchema);

export default Secret;
