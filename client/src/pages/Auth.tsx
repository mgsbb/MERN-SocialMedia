import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import './styles.css';
import { signIn, signUp } from '../actions/auth';
import { clearAlert } from '../actions/alert';
import { useAppDispatch, useAppSelector } from '../hooks';

// ============================================================================================
// Initial state
// ============================================================================================

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export type AuthFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    isGuest?: boolean;
};

// ============================================================================================
// Component
// ============================================================================================
const Auth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const { alertMessage, alertColor } = useAppSelector(
        (state) => state.alertState,
    );

    const token = JSON.parse(localStorage.getItem('profile') as string);

    // ------------------------------------------------------------------------------------------

    // Auth form submit
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignUp) {
            dispatch(signUp(formData, navigate));
        } else {
            dispatch(signIn(formData, navigate));
        }
    };

    // Auth input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Auth toggle between sign in and sign up
    const handleToggle = () => {
        setIsSignUp((prev) => !prev);
        dispatch(clearAlert());
    };

    // Guest submit
    const handleGuestSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(
            signUp(
                {
                    firstName: 'Guest',
                    lastName: 'User',
                    email: 'guestuser@guesthouse.com',
                    password: 'guest',
                    confirmPassword: 'guest',
                    isGuest: true,
                },
                navigate,
            ),
        );
    };

    // ------------------------------------------------------------------------------------------

    // navigation depending on user

    if (token) {
        return <Navigate to='/home' />;
    }

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    return (
        <div className='center'>
            <div className='form-container'>
                {/* Auth failure message */}
                {alertMessage && (
                    <h2
                        className='auth-failure-message center'
                        style={{ color: `${alertColor}` }}
                    >
                        {alertMessage}
                    </h2>
                )}

                {/* Form heading */}
                <h1 className='form-heading'>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </h1>

                {/* Form */}
                <form className='form create-form' onSubmit={handleSubmit}>
                    {isSignUp && (
                        <>
                            {/* First Name */}
                            <div className='input-group'>
                                <label htmlFor='firstName' className='label'>
                                    First Name
                                </label>
                                <input
                                    type='text'
                                    name='firstName'
                                    id='firstName'
                                    className='input'
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div className='input-group'>
                                <label htmlFor='lastName' className='label'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    name='lastName'
                                    id='lastName'
                                    className='input'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Email */}
                    <div className='input-group'>
                        <label htmlFor='email' className='label'>
                            Email
                        </label>
                        <input
                            type='email'
                            name='email'
                            id='email'
                            className='input'
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className='input-group'>
                        <label htmlFor='password' className='label'>
                            Password
                        </label>
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            name='password'
                            id='password'
                            className='input password'
                            onChange={handleChange}
                            required
                        />
                        <button
                            type='button'
                            className='show-password-icon'
                            onClick={() => setIsShowPassword((prev) => !prev)}
                        >
                            {isShowPassword ? (
                                <i className='fa-solid fa-eye-slash'></i>
                            ) : (
                                <i className='fa-solid fa-eye'></i>
                            )}
                        </button>
                    </div>

                    {/* ConfirmPassword */}
                    {isSignUp && (
                        <div className='input-group'>
                            <label htmlFor='confirmPassword' className='label'>
                                Confirm Password
                            </label>
                            <input
                                type={isShowPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                id='confirmPassword'
                                className='input'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {/* Sign In/Sign Up btn */}
                    <div className='btn-container'>
                        <button className='btn'>
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>

                    {/* Switch between isSignUp */}
                    <div className='btn-container'>
                        <button
                            type='button'
                            className='btn btn-outline'
                            onClick={handleToggle}
                        >
                            {isSignUp
                                ? `Already have an account? Sign In`
                                : `Don't have an account? Sign Up`}
                        </button>
                    </div>
                </form>

                {/* Guest login */}
                <form onSubmit={handleGuestSubmit}>
                    <div className='btn-container'>
                        <button className='btn'>Continue as Guest</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============================================================================================

export default Auth;
