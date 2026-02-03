import {
    GET_POST,
    GET_POSTS,
    CREATE_POST,
    UPDATE_POST,
    DELETE_POST,
    DELETE_POSTS_OF_USER,
    CLEAR_ALL_POSTS,
} from '../constants/actionTypes';

import { startLoading, endLoading } from './loading';
import { setAlert } from './alert';

import * as api from '../api';
import type { AppDispatch } from '../store';
import type { CreatePostFormData } from '../pages/CreateForm';

// ========================================================================================

// UpdatePost (PostActions component),
// CreateForm (page) - get Post when updating a post to populate the fields with existing values,
// DetailedPost (page) - keep getting the post after every refresh to display the detailed post
export const getPost = (postId: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(startLoading());
        const response = await api.getPost(postId);
        dispatch({ type: GET_POST, payload: response.data.post });
        dispatch(endLoading());
    } catch (error) {
        console.log(error);
        dispatch(endLoading());
    }
};

// ============================================================================================
// Home (page) - keep retrieving the posts after refresh
export const getPosts =
    (
        userId: string | null,
        search: string | null,
        searchTags: string | null,
        sort: string | null,
    ) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(startLoading());
            const response = await api.getPosts(
                userId,
                search,
                searchTags,
                sort,
            );
            dispatch({ type: GET_POSTS, payload: response.data.posts });
            dispatch(endLoading());
        } catch (error) {
            console.log(error);
            dispatch(endLoading());
        }
    };

// ========================================================================================

// CreateForm (page) - create the post with form data
export const createPost =
    (newPost: CreatePostFormData) => async (dispatch: AppDispatch) => {
        try {
            const response = await api.createPost(newPost);
            dispatch({ type: CREATE_POST, payload: response.data.newPost });
            dispatch(setAlert('Created. Redirecting...', 'green'));
            dispatch(endLoading());
        } catch (error) {
            console.log(error);
            dispatch(endLoading());
        }
    };

// ============================================================================================
// CreateForm (page) - update the post with form data
export const updatePost =
    (updatedPost: any, postId: any) => async (dispatch: AppDispatch) => {
        try {
            const { data } = await api.updatePost(updatedPost, postId);
            dispatch({ type: UPDATE_POST, payload: data.updatedPost });
            dispatch(setAlert('Updated. Redirecting...', 'green'));
            dispatch(endLoading());
        } catch (error) {
            console.log(error);
            dispatch(endLoading());
        }
    };

// ============================================================================================
// Card (component) - not anymore, DeletePost (PostActions component)
export const deletePost = (postId: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(startLoading());
        const { data } = await api.deletePost(postId);
        dispatch({ type: DELETE_POST, payload: data.id });
        dispatch(endLoading());
    } catch (error) {
        console.log(error);
        dispatch(endLoading());
    }
};

// ============================================================================================
// Navbar (component)
export const deletePostsOfUser = () => async (dispatch: AppDispatch) => {
    try {
        const { data } = await api.deletePostsOfUser();
        dispatch({ type: DELETE_POSTS_OF_USER, payload: data });
    } catch (error) {
        console.log(error);
        dispatch(endLoading());
    }
};

// ============================================================================================
// Navbar (component) - called after logout is called to remove the posts from RGS
export const clearAllPosts = () => {
    return { type: CLEAR_ALL_POSTS };
};

// ========================================================================================
