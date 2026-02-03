import { isValidObjectId, Types } from 'mongoose';
import { Request, Response } from 'express';
import { PostModel } from '../models/postModel';
import { UserModel } from '../models/userModel';

// ============================================================================================
// Get
// ============================================================================================

export const getPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const post = await PostModel.findById(id);
        res.status(200).json({ post });
    } catch (error) {
        res.status(404).json({ error });
    }
};

// ============================================================================================

export const getPosts = async (req: Request, res: Response) => {
    let { user: userIdString, search, searchTags, sort } = req.query;
    let userId: Types.ObjectId | undefined;

    if (userIdString === 'null' || userIdString === 'undefined') {
        userId = req.tokenData?._id;
    }
    if (sort === 'null') {
        sort = 'latest';
    }

    try {
        const regExpSearch = new RegExp(search as string, 'i');
        const regExpSearchTags = new RegExp(searchTags as string, 'i');

        const queryObject: any = {
            creatorId: userId,
        };

        if (search !== 'null' && search !== '') {
            queryObject.$or = [
                { title: regExpSearch },
                { description: regExpSearch },
            ];
        }

        if (searchTags !== 'null' && searchTags !== '') {
            if (!queryObject.$or) {
                queryObject.$or = [];
            }
            queryObject.$or.push({ tags: { $in: regExpSearchTags } });
        }

        let result = PostModel.find(queryObject);

        //sort
        if (sort === 'az') {
            result.sort('title');
        }
        if (sort === 'za') {
            result.sort('-title');
        }
        if (sort === 'latest') {
            result.sort('-createdAt');
        }
        if (sort === 'oldest') {
            result.sort('createdAt');
        }

        const posts = await result;
        res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error });
    }
};

// ============================================================================================
// Create
// ============================================================================================

export const createPost = async (req: Request, res: Response) => {
    const post = req.body;

    const userId = req.tokenData?._id;
    const isGuest = req.tokenData?.isGuest;

    const newPost = new PostModel({
        ...post,
        creatorId: userId,
        isGuestCreator: isGuest,
        creatorName: `${req.tokenData?.firstName} ${req.tokenData?.lastName}`,
    });

    try {
        await UserModel.findByIdAndUpdate(newPost.creatorId, {
            $push: { posts: newPost._id },
        });
        await newPost.save();
        res.status(201).json({ newPost });
    } catch (error) {
        console.log(error);
        res.status(409).json({ error });
    }
};

// ============================================================================================
// Update
// ============================================================================================

export const updatePost = async (req: Request, res: Response) => {
    const { id: postId } = req.params;
    const postToUpdate = req.body;

    if (!isValidObjectId(postId)) {
        return res.status(404).send(`No post with id ${postId}`);
    }

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { ...postToUpdate, id: postId },
            { new: true },
        );
        res.json({ updatedPost });
    } catch (error) {
        res.json({ error });
    }
};

// ============================================================================================
// Delete
// ============================================================================================

export const deletePost = async (req: Request, res: Response) => {
    const { id: postId } = req.params;

    if (!isValidObjectId(postId)) {
        return res.status(404).send(`No post with id ${postId}`);
    }

    try {
        await PostModel.findByIdAndDelete(postId);
        res.json({ message: 'Post deleted successfully', id: postId });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
};

// ============================================================================================

export const deletePosts = async (req: Request, res: Response) => {
    const userId = req.tokenData?._id;

    try {
        await PostModel.deleteMany({ creatorId: userId });
        res.json({ message: 'Posts of user deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};
