/* eslint-disable no-unused-vars */
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

import AppLayout from './layouts/app-layout';


// Pages import
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Link from './pages/Link';
import RedirectLink from './pages/RedirectLink';
import UrlProvider from './context';
import RequireAuth from './components/RequireAuth';

const router = createBrowserRouter([

  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth childern={<Dashboard />} />
            
        ),
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/link/:id',
        element: (
          <RequireAuth childern={<Link /> } /> 
        )
      },
      {
        path: '/:id',
        element: <RedirectLink />
      }
    ]
  }

]);

const App = () => {

  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  )
}

export default App