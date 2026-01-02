import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

import logo from '../assets/logo-white.png'


export function Layout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/'; // Redireciona para a página de login
    };

    return (
        <div className="min-h-screen bg-black">
            <div className="container mx-auto flex min-h-screen">
                {/* Sidebar */}
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

                    {/* <nav className="space-y-4">
                        {['Home', 'Explore', 'Notifications', 'Messages', 'Profile'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="block text-xl text-white hover:bg-gray-900 rounded-full px-4 py-2"
                            >
                                {item}
                            </a>
                        ))}
                    </nav> */}
                    <button
                        onClick={handleLogout}
                        className="mt-8 w-[60%] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        Sair
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 border-r border-gray-800">{children}</main>

                {/* Right Sidebar */}
                {/* <aside className="w-80 p-4">
                    <div className="bg-gray-900 rounded-2xl p-4">
                        <h2 className="text-xl font-bold text-white mb-4">What's happening</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="text-white">
                                    <p className="text-sm text-gray-400">Trending</p>
                                    <p className="font-bold">Trending Topic {i}</p>
                                    <p className="text-sm text-gray-400">10.{i}K Tweets</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside> */}
            </div>
        </div>
    );
}
