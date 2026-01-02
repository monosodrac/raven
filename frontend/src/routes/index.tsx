// src/routes/index.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { Feed } from '../pages/Feed';
import { Profile } from '../pages/Profile'; // Nova página de perfil
import { useAuth } from '../hooks/useAuth';

// Rota protegida: só acessível se estiver autenticado
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, token } = useAuth();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

// Rota pública: acessível se NÃO estiver autenticado
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, token } = useAuth();

    if (isAuthenticated && token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

// Definição das rotas
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
        path: '/profile', // Nova rota para edição de perfil
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
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}




// import React from 'react';
// import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import { Login } from '../pages/Login';
// import { Signup } from '../pages/Signup';
// import { Feed } from '../pages/Feed';
// import { useAuth } from '../hooks/useAuth';

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//     const { isAuthenticated, token } = useAuth();

//     // Verifica se o token existe e redireciona para login se não estiver autenticado
//     if (!isAuthenticated || !token) {
//         return <Navigate to="/login" replace />;
//     }

//     return <>{children}</>;
// };

// const PublicRoute = ({ children }: { children: React.ReactNode }) => {
//     const { isAuthenticated, token } = useAuth();

//     // Permite acesso ao login se não estiver autenticado
//     if (isAuthenticated && token) {
//         return <Navigate to="/" replace />;
//     }

//     return <>{children}</>;
// };

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: (
//             <ProtectedRoute>
//                 <Feed />
//             </ProtectedRoute>
//         ),
//     },
//     {
//         path: '/login',
//         element: (
//             <PublicRoute>
//                 <Login />
//             </PublicRoute>
//         ),
//     },
//     {
//         path: '/signup',
//         element: (
//             <PublicRoute>
//                 <Signup />
//             </PublicRoute>
//         ),
//     },
// ]);

// export function AppRouter() {
//     return <RouterProvider router={router} />;
// }
