import { Link } from 'react-router-dom';

// ============================================================================================
// Component
// ============================================================================================

const NavListItems = ({
    openFilter,
    handleLogout,
    decodedToken,
    openUserSearch,
}: any) => {
    const userId = decodedToken?._id;
    const firstName = decodedToken?.firstName;
    const lastName = decodedToken?.lastName;

    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------
    return (
        <>
            {/* Search button */}
            <button className='btn search-btn' onClick={openUserSearch}>
                <i className='fa-solid fa-magnifying-glass'></i>
            </button>

            {/* Filter button */}
            <button className='btn search-btn' onClick={openFilter}>
                <i className='fa-solid fa-filter'></i>
            </button>

            {/* Welcome text */}
            <div>
                {
                    <Link to={`users/${userId}`} className='router-link'>
                        Welcome, {`${firstName} ${lastName}`}!
                    </Link>
                }
            </div>

            {/* Logout button */}
            <button className='logout-btn' onClick={handleLogout}>
                <i className='fa-solid fa-right-from-bracket fa-xl'></i>
            </button>
        </>
    );
};

// ============================================================================================

export default NavListItems;
