import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================================================
// Component
// ============================================================================================

const UserSearchBox = ({ showUserSearchBox, closeUserSearch }: any) => {
    const [searchName, setSearchName] = useState('');
    const token = JSON.parse(localStorage.getItem('profile') as string)?.token;
    const navigate = useNavigate();

    // ------------------------------------------------------------------------------------------
    const searchUsers = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) {
            navigate('/');
            closeUserSearch();
        } else {
            navigate(`/users?name=${searchName}`);
        }
    };
    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------
    return (
        <div
            className={`search-box ${showUserSearchBox ? '' : 'search-box-hide'}`}
        >
            {/* Close button */}
            <button className='search-box-close btn' onClick={closeUserSearch}>
                X
            </button>

            {/* Search input field */}
            <form onSubmit={searchUsers}>
                <div className='input-group input-group-flex'>
                    <input
                        type='text'
                        className='input search-input'
                        placeholder='search user by name'
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>

                {/* Search go button */}
                <button className='btn go-button'>Go</button>
            </form>
        </div>
    );
};

// ============================================================================================

export default UserSearchBox;
