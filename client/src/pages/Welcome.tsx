import { Link, Navigate } from 'react-router-dom';

import './styles.css';

// ============================================================================================
// Component
// ============================================================================================

const Welcome = () => {
    // navigation depening on user
    const token = JSON.parse(localStorage.getItem('profile') as string);

    if (token) {
        return <Navigate to='/home' />;
    }

    // ------------------------------------------------------------------------------------------

    return (
        <div className='center'>
            <div className='hero'>
                <div>PicUpload</div>
                <Link
                    to='/auth'
                    className='get-started-btn-container router-link'
                >
                    <button className='get-started-btn'>Get Started</button>
                </Link>
            </div>
        </div>
    );
};

// ============================================================================================

export default Welcome;
