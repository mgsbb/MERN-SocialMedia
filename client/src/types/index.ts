import type { JwtPayload } from 'jwt-decode';

export type Post = {
    _id: string;
    title: string;
    description: string;
    selectedFile: string;
    tags: string[];
    createdAt: Date;
    creatorId: string;
    creatorName: string;
};

export interface AuthTokenPayload extends JwtPayload {
    email: string;
    _id: string;
    isGuest: boolean;
    firstName: string;
    lastName: string;
}

export type User = {
    _id: string;
    firstName: string;
    lastName: string;
};

export type UpdateUserFormData = {
    firstName: string;
    lastName: string;
    email: string;
    currentPassword: string;
    newPassword: string;
};
