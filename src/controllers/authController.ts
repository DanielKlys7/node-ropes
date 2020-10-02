import User from 'models/User';

const auth_signup = (req, res) => {
    const user = new User({
        username: 'Janxek',
        password: 'Hello',
        isAdmin: false,
    });

    user.save().then(result => res.send(result));
};

export default {
    auth_signup,
};
