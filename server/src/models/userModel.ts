import { Schema, model, InferSchemaType, Types } from 'mongoose';

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },

        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        posts: {
            type: [{ type: Types.ObjectId, ref: 'Post' }],
            default: [],
        },

        isGuest: { type: Boolean, default: false },
    },
    { timestamps: true },
);

userSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 3600,
        partialFilterExpression: { isGuest: true },
    },
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model<User>('User', userSchema);
