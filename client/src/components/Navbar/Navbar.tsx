import { useCallback, useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './styles.css';
import { deleteUser, logout } from '../../actions/auth';

import { clearAllPosts, deletePostsOfUser } from '../../actions/posts';
import { hideModal, showModal } from '../../actions/modal';
import { Modal } from '../index';

import FilterBox from './FilterBox';
import UserSearchBox from './UserSearchBox';
import NavListItems from './NavListItems';
import { endLoading, startLoading } from '../../actions/loading';
import { useAppDispatch, useAppSelector } from '../../hooks';
import type { AuthTokenPayload } from '../../types';

// ============================================================================================
// Component
// ============================================================================================

const Navbar = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;
    const navigate = useNavigate();

    const {
        isShowModal,
        context: modalContext,
        isConfirmModal,
    } = useAppSelector((state) => state.modalState);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showFilterBox, setShowFilterBox] = useState(false);
    const [showUserSearchBox, setShowUserSearchBox] = useState(false);

    // ------------------------------------------------------------------------------------------
    // Decode token
    const decodedToken: AuthTokenPayload | null = useMemo(() => {
        if (!token) return null;
        return jwtDecode(token);
    }, [token]);

    // ------------------------------------------------------------------------------------------

    // Shows the logout modal - modal action decides further actions
    const handleLogout = () => {
        dispatch(showModal('logout'));
    };

    const confirmLogout = useCallback(() => {
        dispatch(startLoading());
        setShowFilterBox(false);
        dispatch(clearAllPosts());
        dispatch(hideModal());
        setTimeout(() => {
            if (decodedToken?.isGuest) {
                dispatch(deletePostsOfUser());
                dispatch(deleteUser());
            } else {
                dispatch(logout());
            }
            navigate('/');
            dispatch(endLoading());
        }, 1000);
    }, [decodedToken, dispatch, navigate]);

    // ------------------------------------------------------------------------------------------
    useEffect(() => {
        // logout upon token expiry
        if (decodedToken?.exp! * 1000 < new Date().getTime()) {
            confirmLogout();
        }
        // logout upon confirm in logout modal
        if (modalContext === 'logout' && isConfirmModal) {
            confirmLogout();
        }
    }, [location, decodedToken, confirmLogout, isConfirmModal, modalContext]);

    // ------------------------------------------------------------------------------------------

    // Filter
    const openFilter = () => {
        setShowFilterBox((prev) => !prev);
        setShowDropdown((prev) => !prev);
        setShowUserSearchBox(false);
    };

    const closeFilter = () => {
        setShowFilterBox((prev) => !prev);
    };

    // ------------------------------------------------------------------------------------------

    // User search
    const openUserSearch = () => {
        setShowUserSearchBox((prev) => !prev);
        setShowDropdown((prev) => !prev);
        setShowFilterBox(false);
    };

    const closeUserSearch = () => {
        setShowUserSearchBox((prev) => !prev);
    };

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    return (
        <>
            <header className='header'>
                <nav className='nav'>
                    <div className='nav-logo-container'>
                        {/* Logo links depends upon existence of user */}
                        {token ? (
                            <Link to='/home' className='nav-logo-link'>
                                <i
                                    className='fa-solid fa-images fa-2xl'
                                    style={{ color: 'rgba(255,255,255,0.7)' }}
                                ></i>
                            </Link>
                        ) : (
                            <Link to='/' className='nav-logo-link'>
                                <i
                                    className='fa-solid fa-images fa-2xl'
                                    style={{ color: 'rgba(255,255,255,0.7)' }}
                                ></i>
                            </Link>
                        )}
                    </div>

                    {token && (
                        <>
                            <div className='nav-right-container sm-hide'>
                                {/* Nav list items - large screen */}
                                <NavListItems
                                    openFilter={openFilter}
                                    handleLogout={handleLogout}
                                    decodedToken={decodedToken}
                                    openUserSearch={openUserSearch}
                                />
                            </div>

                            {/* Hamburg icon - small screen */}
                            <i
                                className='fa-solid fa-bars lg-hide hamburg-icon'
                                onClick={() => {
                                    setShowDropdown((prev) => !prev);
                                    setShowFilterBox(false);
                                    setShowUserSearchBox(false);
                                }}
                            ></i>

                            {/* Nav dropdown */}
                            <div
                                className={`nav-dropdown ${
                                    showDropdown ? '' : 'hide-dropdown'
                                }`}
                            >
                                <div className='dropdown-contents'>
                                    {/* Nav list items - small screen in dropdown */}
                                    <NavListItems
                                        openFilter={openFilter}
                                        handleLogout={handleLogout}
                                        decodedToken={decodedToken}
                                        openUserSearch={openUserSearch}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </nav>
            </header>

            {/* Logout modal */}
            {isShowModal && modalContext === 'logout' && (
                <Modal modalData={{ heading: 'Confirm Logout?' }} />
            )}

            {/* Filter box */}
            <FilterBox
                showFilterBox={showFilterBox}
                closeFilter={closeFilter}
            />

            {/* User Search box */}
            <UserSearchBox
                showUserSearchBox={showUserSearchBox}
                closeUserSearch={closeUserSearch}
            />
        </>
    );
};

// ============================================================================================

export default Navbar;
