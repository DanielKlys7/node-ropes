import { Error as _Error } from 'mongoose';

interface Error extends _Error.ValidatorError {
    code: number;
    errors: { properties: { [path: string]: _Error.ValidatorError | _Error.CastError } };
}

export default Error;
