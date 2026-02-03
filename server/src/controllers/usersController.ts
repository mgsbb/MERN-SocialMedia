import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthTokenPayload } from '../types/express';
import { Types } from 'mongoose';

export const signUp = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, confirmPassword, isGuest } =
        req.body;

    try {
        if (!isGuest) {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            if (password !== confirmPassword) {
                return res
                    .status(400)
                    .json({ message: `Passwords don't match` });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await UserModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            isGuest,
        });

        const authTokenPayload: AuthTokenPayload = {
            email: newUser.email,
            _id: newUser._id,
            isGuest: newUser.isGuest,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
        };

        const token = jwt.sign(authTokenPayload, env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        res.status(200).json({
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password,
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const authTokenPayload: AuthTokenPayload = {
            email: existingUser.email,
            _id: existingUser._id,
            isGuest: existingUser.isGuest,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        };

        const token = jwt.sign(authTokenPayload, env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        res.status(200).json({
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { _id: userId } = req.tokenData!;
        await UserModel.findByIdAndDelete(userId);
        res.status(201).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};
// ============================================================================================

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, currentPassword, newPassword } =
            req.body;
        const { _id: userId } = req.tokenData!;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ message: `User doesn't exist` });
        }

        if (user.isGuest) {
            res.status(404).send({ message: `Cannot update guest user` });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password,
        );

        if (!isPasswordCorrect) {
            return res
                .status(404)
                .send({ message: 'Incorrect current password' });
        }

        const newObject: any = {};
        if (firstName !== '') {
            newObject.firstName = firstName;
        }
        if (lastName !== '') {
            newObject.lastName = lastName;
        }
        if (email !== '') {
            newObject.email = email;
        }
        if (newPassword !== '') {
            newObject.password = await bcrypt.hash(newPassword, 12);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            newObject,
        );

        if (updatedUser == null) {
            throw new Error('Something went wrong');
        }

        const authTokenPayload: AuthTokenPayload = {
            email: updatedUser.email,
            _id: updatedUser._id,
            isGuest: updatedUser.isGuest,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
        };

        const token = jwt.sign(authTokenPayload, env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        res.status(200).json({ message: 'User updated successfully', token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong' });
    }
};
// ============================================================================================

export const getUserDetails = async (req: Request, res: Response) => {
    const userIdString = req.params.userId;
    let userId: Types.ObjectId;

    if (userIdString === 'null') {
        userId = req.tokenData?._id!;
    } else {
        userId = userIdString as any as Types.ObjectId;
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'User does not exist' });
        }

        const userDetails = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
        res.status(200).json({ userDetails });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// ============================================================================================

export const getUsers = async (req: Request, res: Response) => {
    const { userName } = req.query;

    let users: any = [];

    if (userName === null || userName === '' || userName == undefined) {
        return res.status(200).json({ users });
    }

    try {
        const regExpName = new RegExp(userName as string, 'i');

        const queryObject: any = {};

        if (userName !== 'null' && userName !== '') {
            queryObject.$or = [
                { firstName: regExpName },
                { lastName: regExpName },
            ];
        }
        const results = UserModel.find(queryObject);

        // deselect these field
        results.select('-password');
        results.select('-posts');
        results.select('-createdAt');
        results.select('-updatedAt');
        results.select('-isGuest');
        results.select('-email');

        users = await results;
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
