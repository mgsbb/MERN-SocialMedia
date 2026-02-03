import React, { useState, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../actions/auth';
import { LoadingSpinner, Modal } from '../components';
import { hideModal, showModal } from '../actions/modal';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { AuthTokenPayload } from '../types';

// ============================================================================================
// Initial state
// ============================================================================================
const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
};

// ============================================================================================
// Component
// ============================================================================================

const User = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(() => initialState);
    const dispatch = useAppDispatch();
    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;
    const [tokenCurrent, setTokenCurrent] = useState(token);
    const { isLoading } = useAppSelector((state) => state.loadingState);
    const {
        isShowModal,
        isConfirmModal,
        context: modalContext,
    } = useAppSelector((state) => state.modalState);
    const { alertColor, alertMessage } = useAppSelector(
        (state) => state.alertState,
    );

    // ------------------------------------------------------------------------------------------

    // Decode token
    const decodedToken: AuthTokenPayload | null = useMemo(() => {
        if (!tokenCurrent) return null;
        return jwtDecode(tokenCurrent);
    }, [tokenCurrent]);

    // ------------------------------------------------------------------------------------------

    React.useEffect(() => {
        setTokenCurrent(
            JSON.parse(localStorage.getItem('profile') as string)?.token,
        );
        dispatch(getUser(userId));
    }, [dispatch, userId, token]);

    const { userDetails } = useAppSelector((state) => state.authState);

    // ------------------------------------------------------------------------------------------

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (decodedToken?.isGuest) {
            return;
        }
        handleUpdate();
    };

    const handleUpdate = () => {
        dispatch(showModal('updateUser'));
    };

    React.useEffect(() => {
        if (isConfirmModal && modalContext === 'updateUser') {
            dispatch(updateUser(formData));
            dispatch(hideModal());
        }
    }, [isConfirmModal, modalContext, dispatch, formData, userId]);

    // ------------------------------------------------------------------------------------------

    if (!token) {
        return <Navigate to='/' />;
    }

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/* Modal */}
            {isShowModal && modalContext === 'updateUser' && (
                <Modal modalData={{ heading: 'Confirm User Update?' }} />
            )}

            {/* UserDetails */}
            <div className='center'>
                {/* Misleading classNames */}
                <div className='form-container'>
                    <div className='form'>
                        <i className='fa-regular fa-user fa-2xl form-heading'></i>
                        {/* Full name */}
                        <h1 className='form-heading user-details'>
                            {`${userDetails?.firstName} ${userDetails?.lastName}`}
                        </h1>

                        {/* Email */}
                        <h3 className='form-heading'>{userDetails?.email}</h3>

                        {/* Button to visit user posts */}
                        {decodedToken?._id !== userId && (
                            <button
                                className='btn btn-outline'
                                onClick={() => {
                                    navigate(`/home?userId=${userId}`);
                                }}
                            >
                                Visit posts by user
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Update form */}

            {decodedToken?._id === userId && (
                <div className='center'>
                    <div
                        className='form-container'
                        style={{ marginTop: '-2vh' }}
                    >
                        {/* Guest user message */}
                        {decodedToken?.isGuest && (
                            <h3
                                className='form-heading'
                                style={{ color: 'red' }}
                            >
                                Guest user cannot be updated
                            </h3>
                        )}

                        {/* Update failure - message */}
                        {alertMessage && (
                            <h2
                                className='auth-failure-message center'
                                style={{ color: `${alertColor}` }}
                            >
                                {alertMessage}
                            </h2>
                        )}

                        {/* Form heading */}
                        <h1 className='form-heading'>Update User Details</h1>

                        <form onSubmit={handleSubmit} className='form'>
                            <div className='input-group'>
                                <label htmlFor='firstName' className='label'>
                                    First Name
                                </label>
                                <input
                                    type='text'
                                    id='firstName'
                                    name='firstName'
                                    className='input'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='input-group'>
                                <label htmlFor='lastName' className='label'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    id='lastName'
                                    name='lastName'
                                    className='input'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='input-group'>
                                <label htmlFor='email' className='label'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    className='input'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='input-group'>
                                <label
                                    htmlFor='currentPassword'
                                    className='label'
                                >
                                    Current Password
                                </label>
                                <input
                                    type='password'
                                    id='currentPassword'
                                    name='currentPassword'
                                    className='input'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='input-group'>
                                <label htmlFor='newPassword' className='label'>
                                    New Password
                                </label>
                                <input
                                    type='password'
                                    id='newPassword'
                                    name='newPassword'
                                    className='input'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='input-group'>
                                <button className='btn btn-outline'>
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

// ============================================================================================

export default User;
