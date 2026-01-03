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
                <aside className="min-w-48 border-r border-gray-800 p-4 relative min-h-screen">
                    <div className="fixed">
                        <div className="mb-8">
                            <img src={logo} alt="Logo do Raven" className="h-24 w-24 text-white" />
                        </div>
                        <nav className="space-y-4">
                            <Link
                                to="/"
                                className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                            >
                                Home
                            </Link>
                            <Link
                                to="/followers"
                                className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                            >
                                Followers
                            </Link>
                            <Link
                                to="/following"
                                className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                            >
                                Following
                            </Link>
                            <Link
                                to="/profile"
                                className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                            >
                                Profile
                            </Link>
                        </nav>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full fixed max-w-100 bottom-8"
                    >
                        Logout
                    </button>
                </aside>

                <main className="flex-1 border-r border-gray-800">{children}</main>
            </div>
        </div>
    );
}
