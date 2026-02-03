import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types';

// ============================================================================================
// Component
// ============================================================================================
const UpdatePost = ({ post }: { post: Post }) => {
    const navigate = useNavigate();

    const handleUpdate = async () => {
        navigate(`/update/${post._id}`);
    };

    return <i className='fa-solid fa-pen edit-btn' onClick={handleUpdate}></i>;
};

// ============================================================================================

export default UpdatePost;
