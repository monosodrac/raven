import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

import logo from '../assets/logo-white.png'


export function Layout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto flex min-h-screen">
                <aside className="w-64 border-r border-gray-800 p-4">
                    <div className="mb-8">
                        <img src={logo} alt="Logo do R" className="h-24 w-24 text-white" />
                    </div>
                    <nav className="space-y-4">
                        <Link
                            to="/"
                            className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                        >
                            Home
                        </Link>
                        <Link
                            to="/explore"
                            className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                        >
                            Explore
                        </Link>
                        <Link
                            to="/notifications"
                            className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                        >
                            Notifications
                        </Link>
                        <Link
                            to="/messages"
                            className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                        >
                            Messages
                        </Link>
                        <Link
                            to="/profile"
                            className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                        >
                            Profile
                        </Link>
                        </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-8 w-[60%] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Sair
                    </button>
                </aside>

                <main className="flex-1 border-r border-gray-800">{children}</main>
            </div>
        </div>
    );
}
