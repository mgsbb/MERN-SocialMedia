import { useEffect } from 'react';
import { getUsers } from '../actions/auth';
import { useQuery } from './Home';

import { UserCard } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import type { User } from '../types';

// ============================================================================================
// Component
// ============================================================================================

const UserSearchResults = () => {
    const query = useQuery();
    const userName = query.get('name');
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.loadingState);

    // ------------------------------------------------------------------------------------------

    useEffect(() => {
        dispatch(getUsers(userName));
    }, [userName, dispatch]);

    const { users } = useAppSelector((state) => state.authState);
    // ------------------------------------------------------------------------------------------
    // Return
    // ------------------------------------------------------------------------------------------

    // Loading finished and no posts found
    if (!isLoading && users.length === 0) {
        return (
            <div style={{ width: '100vw', height: '100vh' }}>
                <div className='no-posts-text'>NO USERS FOUND</div>
            </div>
        );
    }

    return (
        <div className='home-bg'>
            {/* Mapping of users as UserCard components*/}
            <div className='center'>
                <div className='grid-container'>
                    {users?.map((user: User) => (
                        <UserCard user={user} key={user._id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================================
export default UserSearchResults;
