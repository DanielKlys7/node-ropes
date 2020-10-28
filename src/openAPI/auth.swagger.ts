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
