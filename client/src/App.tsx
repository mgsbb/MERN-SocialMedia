import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {
    Auth,
    Welcome,
    Home,
    CreateForm,
    ErrorPage,
    DetailedPost,
    SharedLayout,
    User,
    UserSearchResults,
} from './pages';

// ============================================================================================
// Component
// ============================================================================================

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<SharedLayout />}>
                    <Route index element={<Welcome />} />
                    <Route path='home' element={<Home />} />
                    <Route path='auth' element={<Auth />} />
                    <Route path='create' element={<CreateForm />} />
                    <Route path='update/:postId' element={<CreateForm />} />
                    <Route path='posts/:postId' element={<DetailedPost />} />
                    <Route path='users' element={<UserSearchResults />} />
                    <Route path='users/:userId' element={<User />} />
                    <Route path='users/:userId/posts' element={<Home />} />
                </Route>
                <Route path='*' element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
};

// ============================================================================================

export default App;
