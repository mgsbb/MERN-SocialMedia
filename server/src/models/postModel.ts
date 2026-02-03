import { Schema, model, InferSchemaType, Types } from 'mongoose';

const postSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        selectedFile: { type: String },
        tags: { type: [String], default: [] },

        creatorId: { type: Types.ObjectId, ref: 'User' },
        isGuestCreator: { type: Boolean, default: false },
        creatorName: { type: String },
    },
    { timestamps: true },
);

postSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 3600,
        partialFilterExpression: { isGuestCreator: true },
    },
);

export type Post = InferSchemaType<typeof postSchema>;

export const PostModel = model<Post>('Post', postSchema);
