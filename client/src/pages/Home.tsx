import { useEffect, useMemo } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './styles.css';
import { getPosts } from '../actions/posts';
import { LoadingSpinner, Card, Modal } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { AuthTokenPayload, Post } from '../types';

// ============================================================================================

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// ============================================================================================
// Component
// ============================================================================================

const Home = () => {
    const dispatch = useAppDispatch();
    const { posts } = useAppSelector((state) => state.postState);
    const { isLoading } = useAppSelector((state) => state.loadingState);
    const modalState = useAppSelector((state) => state.modalState);

    const query = useQuery();
    const search = query.get('search');
    const searchTags = query.get('searchTags');
    const sort = query.get('sort');
    const userId = query.get('userId');
    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;
    // ------------------------------------------------------------------------------------------
    // token decode
    let decodedToken: AuthTokenPayload | null;

    decodedToken = useMemo(() => {
        if (!token) return null;
        return jwtDecode(token);
    }, [token]);

    // ------------------------------------------------------------------------------------------

    // get posts upon refresh
    useEffect(() => {
        dispatch(getPosts(userId, search, searchTags, sort));
    }, [dispatch, userId, search, searchTags, sort]);

    // ------------------------------------------------------------------------------------------

    // navigation depending on user
    if (!token) {
        return <Navigate to='/' />;
    }

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    // Loading state
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Loading finished and no posts found
    if (!isLoading && posts.length === 0) {
        return (
            <div style={{ width: '100vw', height: '100vh' }}>
                <div className='no-posts-text'>NO POSTS FOUND</div>
                <Link to='/create'>
                    {/* Plus btn*/}
                    <button className={`plus-icon-container`}>
                        <i className={`fa-solid fa-plus plus-icon`}></i>
                    </button>

                    <div className='add-text'>Add</div>
                </Link>
            </div>
        );
    }

    return (
        <div className='home-bg'>
            {/* Deletion Modal shows when delete btn clicked on any Card component */}
            {modalState.isShowModal && modalState.context === 'deletePost' && (
                <Modal modalData={{ heading: 'Confirm Deletion?' }} />
            )}

            <Link to='/create'>
                {/* Plus btn*/}
                <button className={`plus-icon-container`}>
                    <i className={`fa-solid fa-plus plus-icon`}></i>
                </button>

                <div className='add-text'>Add</div>
            </Link>

            {/* Mapping of actual posts as Card components*/}
            <div className='center'>
                <div className='grid-container'>
                    {posts?.map((post: Post) => (
                        <Card post={post} key={post._id} />
                    ))}
                </div>
            </div>

            {/* Guest user message */}
            {decodedToken?.isGuest && (
                <div className='guest-user-message'>
                    User and posts will be deleted in 1h. Sign in to persist
                    data.
                </div>
            )}
        </div>
    );
};

// ============================================================================================

export default Home;
