import axios from 'axios';

// ============================================================================================
// Instance
// ============================================================================================

const API = axios.create({ baseURL: '/api/v1' });

// ============================================================================================
// Interceptors
// ============================================================================================

API.interceptors.request.use(
    (req) => {
        if (localStorage.getItem('profile')) {
            req.headers.Authorization = `Bearer ${
                JSON.parse(localStorage.getItem('profile') as string)?.token
            }`;
        }
        return req;
    },
    (error) => console.log(error),
);

// ============================================================================================
// Posts
// ============================================================================================

export const getPost = (postId: string) => API.get(`/posts/${postId}`);

export const getPosts = (
    userId: string | null,
    search: string | null,
    searchTags: string | null,
    sort: string | null,
) =>
    API.get(
        `/posts?user=${userId}&search=${search}&searchTags=${searchTags}&sort=${sort}`,
    );

export const createPost = (newPost: any) => API.post('/posts', newPost);

export const updatePost = (updatedPost: any, postId: any) =>
    API.patch(`/posts/${postId}`, updatedPost);

export const deletePost = (postId: any) => API.delete(`/posts/${postId}`);

export const deletePostsOfUser = () => API.delete(`/posts`);

// ============================================================================================
// Users
// ============================================================================================

export const signUp = (authData: any) => API.post('/users/signup', authData);

export const signIn = (authData: any) => API.post('/users/signin', authData);

export const deleteUser = () => API.delete(`/users/userId`);

export const updateUser = (formData: any) =>
    API.patch(`/users/userId`, formData);

export const getUser = (userId: any) => {
    return API.get(`/users/${userId}`);
};

export const getUsers = (userName: any) => {
    return API.get(`/users?userName=${userName}`);
};
