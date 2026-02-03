import express from 'express';
import {
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    deletePosts,
} from '../controllers/postsController';

import authMiddleware from '../middlewares/authMiddleware';

// ============================================================================================

const router = express.Router();

router.get('/', authMiddleware, getPosts);
router.get('/:id', authMiddleware, getPost);

router.post('/', authMiddleware, createPost);
router.patch('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.delete('/', authMiddleware, deletePosts);

// ============================================================================================
export default router;
