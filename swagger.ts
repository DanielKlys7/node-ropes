import { signup } from 'openAPI/auth.swagger';

export default {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: 'Swagger for jiujiteiro',
        termsOfService: '',
        contact: {
            name: 'Daniel klys',
            email: 'danielklys7@gmail.com',
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    paths: {
        '/auth/signup': {
            post: signup,
        },
    },
};
