import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './styles.css';
import DeletePost from './PostActions/DeletePost';
import UpdatePost from './PostActions/UpdatePost';
import type { AuthTokenPayload, Post } from '../types';

// ============================================================================================
// Component
// ============================================================================================

const Card = ({ post }: { post: Post }) => {
    const navigate = useNavigate();

    const dateFormatted = post?.createdAt?.toString().split('T')[0];
    const timeFormatted = post?.createdAt
        ?.toString()
        .split('T')[1]
        .substring(0, 5);

    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;

    // ------------------------------------------------------------------------------------------
    // Decode token
    const decodedToken: AuthTokenPayload | null = useMemo(() => {
        if (!token) return null;
        return jwtDecode(token);
    }, [token]);
    // ------------------------------------------------------------------------------------------

    const detailedPost = () => {
        navigate(`/posts/${post._id}`);
    };

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------
    return (
        <div className='card'>
            {/* Card Image */}
            <div
                className='card-img'
                style={{ backgroundImage: `url(${post.selectedFile})` }}
            >
                <div className='card-img-overlay'>
                    {/* delete/edit the post only when post is created by the current user */}
                    {decodedToken?._id === post?.creatorId && (
                        <>
                            <div className='delete-post-container'>
                                <DeletePost post={post} />
                            </div>

                            <div className='edit-post-container'>
                                <UpdatePost post={post} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Card tags, title, desc */}
            <div style={{ cursor: 'pointer' }} onClick={detailedPost}>
                <p className='card-tags'>
                    {post?.tags?.map((tag) => (tag ? `#${tag} ` : ''))}
                </p>
                <h3 className='card-title'>{post?.title}</h3>
                <p className='card-desc'>{post?.description}</p>

                {/* Card date, creator */}
                <div className='card-bottom'>
                    <p className='card-date'>
                        {`${dateFormatted} ${timeFormatted}`}
                        <span className='card-date-tooltip'>
                            <span style={{ fontSize: '1.5rem' }}>
                                created at{' '}
                            </span>
                            {`${dateFormatted} ${timeFormatted}`}
                        </span>
                    </p>

                    <p className='card-creator'>
                        {post?.creatorName}
                        <span className='card-creator-tooltip'>
                            <span style={{ fontSize: '1.5rem' }}>
                                created by{' '}
                            </span>
                            {post?.creatorName}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

// ============================================================================================

export default Card;
