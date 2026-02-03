import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            tokenData?: AuthTokenPayload;
        }
    }
}

export {};

export interface AuthTokenPayload extends JwtPayload {
    email: string;
    _id: Types.ObjectId;
    isGuest: boolean;
    firstName: string;
    lastName: string;
}
