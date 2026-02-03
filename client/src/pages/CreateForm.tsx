import React, { useState, useEffect } from 'react';
import {
    useNavigate,
    useLocation,
    useParams,
    Navigate,
} from 'react-router-dom';
// import FileBase from 'react-file-base64';

import './styles.css';
import { createPost, getPost, updatePost } from '../actions/posts';
import { LoadingSpinner, Modal } from '../components';
import { clearAlert } from '../actions/alert';
import { hideModal, showModal } from '../actions/modal';
import { useAppDispatch, useAppSelector } from '../hooks';

// ============================================================================================
// Initial form state
// ============================================================================================
const initialState: CreatePostFormData = {
    title: '',
    description: '',
    selectedFile: '',
    tags: [],
};

export type CreatePostFormData = {
    title: string;
    description: string;
    selectedFile?: string;
    tags: string[];
};

// ============================================================================================
// Component
// ============================================================================================

const CreateForm = () => {
    const [formData, setFormData] = useState(initialState);

    const {
        isShowModal,
        isConfirmModal,
        context: modalContext,
    } = useAppSelector((state) => state.modalState);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isUpdate = location.pathname !== '/create' ? true : false;
    const { alertMessage, alertColor } = useAppSelector(
        (state) => state.alertState,
    );

    const { postId } = useParams();

    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;

    // ------------------------------------------------------------------------------------------

    // getPost everytime refresh is clicked when updating
    useEffect(() => {
        if (isUpdate) {
            dispatch(getPost(postId));
        }
    }, [dispatch, isUpdate, postId]);

    // ------------------------------------------------------------------------------------------

    const { post: currentPost } = useAppSelector((state) => state.postState);
    const { isLoading } = useAppSelector((state) => state.loadingState);

    // setFormData with values from the redux store upon refresh
    useEffect(() => {
        if (isUpdate) {
            setFormData(() => {
                return {
                    title: currentPost?.title,
                    description: currentPost?.description,
                    tags: currentPost?.tags,
                };
            });
        }
    }, [isUpdate, currentPost]);

    // ------------------------------------------------------------------------------------------

    // form submission
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isUpdate) {
            handleUpdate();
        } else {
            dispatch(createPost(formData));
            setTimeout(() => {
                navigate('/home');
                dispatch(clearAlert());
            }, 2000);
        }
    };

    // form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangeTextArea = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ------------------------------------------------------------------------------------------

    // Updating modal
    const handleUpdate = () => {
        dispatch(showModal('updatePost'));
    };

    React.useEffect(() => {
        if (isConfirmModal) {
            dispatch(updatePost(formData, currentPost._id));
            dispatch(hideModal());

            setTimeout(() => {
                navigate(-1);
                dispatch(clearAlert());
            }, 2000);
        }
    }, [isConfirmModal, dispatch, navigate, formData, currentPost]);

    // ------------------------------------------------------------------------------------------
    // navigation depending on user
    if (!token) {
        return <Navigate to='/' />;
    }

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    if (isLoading && isUpdate) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className='center'>
                {/* Updation Modal */}
                {isShowModal && modalContext === 'updatePost' && (
                    <Modal modalData={{ heading: 'Confirm Updation?' }} />
                )}

                {/* Form container*/}
                <div className='form-container'>
                    {/* Alert message */}
                    {alertMessage && (
                        <h2
                            className='auth-failure-message center'
                            style={{ color: `${alertColor}` }}
                        >
                            {alertMessage}
                        </h2>
                    )}

                    <div className='create-form-header'>
                        {/* Form heading */}
                        <h1 className='form-heading'>
                            {isUpdate ? 'Update PicUpload' : 'Create PicUpload'}
                        </h1>

                        {/* Back home btn */}
                        <button
                            className='back-home-container'
                            onClick={() => navigate(-1)}
                        >
                            <h1>
                                <i className='fa-solid fa-angle-left'></i>
                            </h1>
                        </button>
                    </div>

                    {/* Form */}
                    <form className='form create-form' onSubmit={handleSubmit}>
                        <div className='input-group'>
                            {/* Title */}
                            <label htmlFor='title' className='label'>
                                Title
                            </label>
                            <input
                                type='text'
                                name='title'
                                id='title'
                                className='input'
                                onChange={handleChange}
                                value={formData.title}
                            />
                        </div>

                        {/* Description */}
                        <div className='input-group'>
                            <label htmlFor='description' className='label'>
                                Description
                            </label>
                            <textarea
                                name='description'
                                id='description'
                                cols={30}
                                rows={10}
                                className='input textarea'
                                value={formData.description}
                                onChange={handleChangeTextArea}
                            ></textarea>
                        </div>

                        {/* File */}
                        {/*                         
                        <div className='input-group'>
                            <FileBase
                                type='file'
                                multiple={false}
                                onDone={({ base64 }) =>
                                    setFormData({
                                        ...formData,
                                        selectedFile: base64,
                                    })
                                }
                            />
                        </div> */}

                        {/* Tags */}
                        <div className='input-group'>
                            <label htmlFor='tags' className='label'>
                                Tags{' '}
                                <div className='tags'>(comma separated)</div>
                            </label>
                            <input
                                type='text'
                                name='tags'
                                id='tags'
                                value={formData.tags}
                                className='input'
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tags: e.target.value.trim().split(','),
                                    })
                                }
                            />
                        </div>

                        {/* Submit btn */}
                        <div className='input-group'>
                            <button type='submit' className='btn'>
                                Submit
                            </button>
                        </div>

                        {/* Clear input btn */}
                        <div className='input-group'>
                            <button
                                type='button'
                                className='btn btn-outline'
                                onClick={() =>
                                    setFormData({
                                        title: '',
                                        description: '',
                                        tags: [],
                                    })
                                }
                            >
                                Clear Input
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// ============================================================================================

export default CreateForm;
