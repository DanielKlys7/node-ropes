import { Document } from 'mongoose';

export interface User {
    email: string;
    password: string;
}

export interface UserModelType extends User, Document {}
