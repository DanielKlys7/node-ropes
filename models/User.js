const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            required: true,
            type: 'string',
        },
        password: {
            required: true,
            type: 'string',
        },
        isAdmin: {
            required: true,
            type: 'boolean',
        },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);
module.exports = User;
