import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles.css';
import { showModal, hideModal } from '../../actions/modal';
import { deletePost } from '../../actions/posts';
import { setPostId } from '../../actions/modal';
import type { Post } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks';

// ============================================================================================
// Component
// ============================================================================================

const DeletePost = ({ post }: { post: Post }) => {
    const modalState = useAppSelector((state) => state.modalState);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // ------------------------------------------------------------------------------------------

    const handleDelete = () => {
        // When delete button clicked - show deletion modal in the appropriate page and pass in context
        dispatch(showModal('deletePost'));
        dispatch(setPostId(post._id));
    };

    // EXCEPTION
    const postId = useAppSelector((state) => state.modalState?.postId);

    useEffect(() => {
        // listen to confirm button click on modal
        if (modalState.isConfirmModal && modalState.context === 'deletePost') {
            dispatch(deletePost(postId));
            dispatch(hideModal());
            navigate('/home');
        }
    }, [modalState, dispatch, navigate, postId]);

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    return (
        <i className='fa-solid fa-trash delete-btn' onClick={handleDelete}></i>
    );
};

// ============================================================================================

export default DeletePost;
