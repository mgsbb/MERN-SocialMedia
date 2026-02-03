import {
    GET_POSTS,
    GET_POST,
    CREATE_POST,
    UPDATE_POST,
    DELETE_POST,
    DELETE_POSTS_OF_USER,
    CLEAR_ALL_POSTS,
} from '../constants/actionTypes';
import type { Post } from '../types';

// ============================================================================================

const postsReducer = (
    postState = { posts: [], currentPost: null, isLoading: true, post: null },
    action: any,
) => {
    switch (action.type) {
        case GET_POST:
            return { ...postState, post: action.payload };

        case GET_POSTS:
            return { ...postState, posts: action.payload };

        case CREATE_POST:
            return {
                ...postState,
                posts: [...postState.posts, action.payload],
            };

        case UPDATE_POST:
            return {
                ...postState,
                posts: postState.posts.map((post: Post) =>
                    post._id === action.payload._id ? action.payload : post,
                ),
            };

        case DELETE_POST:
            return {
                ...postState,
                posts: postState.posts.filter(
                    (post: Post) => post._id !== action.payload,
                ),
            };

        case DELETE_POSTS_OF_USER:
        case CLEAR_ALL_POSTS:
            return { ...postState, posts: [] };

        default:
            return postState;
    }
};

// ============================================================================================

export default postsReducer;
