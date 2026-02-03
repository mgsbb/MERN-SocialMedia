import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './styles.css';
import { DeletePost, Modal, UpdatePost, LoadingSpinner } from '../components';
import { getPost } from '../actions/posts';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { AuthTokenPayload } from '../types';

// ============================================================================================
// Component
// ============================================================================================

const DetailedPost = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const modalState = useAppSelector((state) => state.modalState);
    const { postId } = useParams();

    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;

    // ------------------------------------------------------------------------------------------
    // Decode token
    const decodedToken: AuthTokenPayload | null = useMemo(() => {
        if (!token) return null;
        return jwtDecode(token);
    }, [token]);

    // ------------------------------------------------------------------------------------------
    // keep getting the post upon refresh
    useEffect(() => {
        dispatch(getPost(postId));
    }, [postId, dispatch]);

    const { post: currentPost } = useAppSelector((state) => state.postState);
    const { isLoading } = useAppSelector((state) => state.loadingState);
    const dateFormatted = currentPost?.createdAt.toString().split('T')[0];
    const timeFormatted = currentPost?.createdAt
        .toString()
        .split('T')[1]
        .substring(0, 5);

    // ------------------------------------------------------------------------------------------

    // navigation depending on user
    if (!token) {
        return <Navigate to='/' />;
    }

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    if ((!isLoading && currentPost === null) || token === null) {
        return (
            <>
                <div className='post-not-found center'>POST NOT FOUND</div>
                <div className='back-home-btn-container'>
                    <button
                        className='btn back-home-btn'
                        onClick={() => {
                            navigate('/home');
                        }}
                    >
                        BACK HOME
                    </button>
                </div>
            </>
        );
    }

    // ------------------------------------------------------------------------------------------

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/* Deletion Modal shows when delete btn clicked on any Card component */}
            {modalState.isShowModal && (
                <Modal modalData={{ heading: 'Confirm Deletion?' }} />
            )}

            <div className='center'>
                <div className='lg-card-container'>
                    {/* Card image */}
                    <div
                        className='lg-card-img'
                        style={{
                            backgroundImage: `url(${currentPost?.selectedFile})`,
                        }}
                    >
                        <div className='lg-card-img-overlay'>
                            {/* Back home btn */}
                            <button
                                className='lg-card-back-home'
                                onClick={() => navigate(-1)}
                            >
                                <h1>
                                    <i className='fa-solid fa-angle-left'></i>
                                </h1>
                            </button>
                        </div>
                    </div>

                    <div className='lg-card-bottom'>
                        <div className='lg-card-top-row'>
                            <div className='lg-card-date-time'>
                                {/* Card date and time */}
                                <p>
                                    <i className='fa-solid fa-calendar'></i>{' '}
                                    {dateFormatted}
                                </p>
                                <p>
                                    <i className='fa-solid fa-clock'></i>{' '}
                                    {timeFormatted}
                                </p>
                            </div>

                            <div className='lg-card-edit-delete'>
                                <p className='lg-card-creator'>
                                    {/* Card creator */}
                                    <i className='fa-solid fa-user'></i>{' '}
                                    {currentPost?.creatorName}
                                </p>
                                {/* Display edit/delete btns when post created by currentUser */}
                                {decodedToken?._id ===
                                    currentPost?.creatorId && (
                                    <>
                                        <DeletePost post={currentPost} />
                                        <UpdatePost post={currentPost} />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Card title */}
                        <h1 className='lg-card-title'>{currentPost?.title}</h1>

                        {/* Card tags */}
                        <h3>
                            {currentPost?.tags.map((tag: string) =>
                                tag ? `#${tag} ` : '',
                            )}
                        </h3>

                        {/* Card desc */}
                        <p className='lg-card-desc'>
                            {currentPost?.description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

// ============================================================================================

export default DetailedPost;
