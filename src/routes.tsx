import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Slides from './pages/slides';
import RootLayout from './pages/Layout';
import NotFound from './pages/not-found';

export const router = createBrowserRouter([
    {
        path: '',
        element: <RootLayout />,
        children: [
            {
                path:'/',
                element: <Home />
            },
            {
                path:'/slides',
                element: <Slides />
            },
            {
                path:'*',
                element: <NotFound />
            },
        ]
    }
])
