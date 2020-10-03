import User from 'models/User';

const handleErrors = err => {
    console.log(err.message, err.code);
    let error = { email: '', password: '' };

    if (err.message.includes('User validation failed')) {
        console.log(err);
    }
};

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

export default {
    signupPost,
};
