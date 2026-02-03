import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types/express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : undefined;

        if (!token) {
            throw new Error('There is no token found');
        }

        const decoded = jwt.verify(token, env.JWT_SECRET!) as AuthTokenPayload;

        req.tokenData = decoded;

        next();
    } catch (error) {
        console.log(error);

        res.status(401).json({ message: 'Unauthorized action' });
    }
};
export default auth;
