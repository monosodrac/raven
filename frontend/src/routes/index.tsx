import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { Feed } from '../pages/Feed';
import { Profile } from '../pages/Profile';
import { useAuth } from '../hooks/useAuth';
import { Followers } from '../pages/Followers';
import { Following } from '../pages/Following';
import { SearchAccounts } from '../pages/SearchAccounts';
import { FollowersByUser } from '../pages/FollowersByUser';
import { FollowingByUser } from '../pages/FollowingByUser';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, token } = useAuth();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, token } = useAuth();

    if (isAuthenticated && token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Feed />
            </ProtectedRoute>
        ),
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },
    {
        path: '/login',
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: '/signup',
        element: (
            <PublicRoute>
                <Signup />
            </PublicRoute>
        ),
    },
    {
        path: '/followers',
        element: (
            <ProtectedRoute>
                <Followers />
            </ProtectedRoute>
        ),
    },
    {
        path: '/following',
        element: (
            <ProtectedRoute>
                <Following />
            </ProtectedRoute>
        ),
    },
    {
        path: '/search-accounts',
        element: (
            <ProtectedRoute>
                <SearchAccounts />
            </ProtectedRoute>
        ),
    },
    {
        path: '/user/:id/followers',
        element: (
            <ProtectedRoute>
                <FollowersByUser />
            </ProtectedRoute>
        ),
    },
    {
        path: '/user/:id/following',
        element: (
            <ProtectedRoute>
                <FollowingByUser />
            </ProtectedRoute>
        ),
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
