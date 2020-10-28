export const signup = {
    tags: ['Auth'],
    description: 'User registration',
    operationId: 'signup',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '201': {
            description: 'User is sucesfully created but still have to be authorized on email.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password', 'first_name', 'last_name'],
                        properties: {
                            email: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                            first_name: {
                                type: 'string',
                            },
                            last_name: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
    },
};

export const login = {
    tags: ['Auth'],
    description: 'User login',
    operationId: 'login',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'User is sucesfully logged in.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password'],
                        properties: {
                            email: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
    },
};

export const emailConfirmRequest = {
    tags: ['Auth'],
    description: 'User request account confirmation email',
    operationId: 'emailConfirmRequest',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'User sucesfully requested confirmation email',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email'],
                        properties: {
                            email: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
    },
};

export const emailConfirm = {
    tags: ['Auth'],
    description: 'User confirmed email',
    operationId: 'emailConfirm',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'User sucesfully confirmed email by secret code',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['userID', 'code'],
                        properties: {
                            userID: {
                                type: 'string',
                            },
                            code: {
                                type: 'string',
                            },
                        },
                    },
                },
            },
        },
    },
};
