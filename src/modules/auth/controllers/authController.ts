import User from '../models/User';

const signupPost = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        res.status(201).json(user);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

const handleErrors = <T extends { message: string; errors: object; code: number }>(err: T) => {
    if (err.code === 11000)
        return {
            email: 'This email is already in registered',
        };

    if (err.message.includes('User validation failed'))
        return Object.values(err.errors).reduce((total: {}, { properties: { path, message } }: any) => {
            total.hasOwnProperty(path) ? (total[path] = [total[path], message]) : (total[path] = message);

            return total;
        }, {});

    return err;
};

export default {
    signupPost,
};
